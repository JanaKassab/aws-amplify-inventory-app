/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import axios from 'axios';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    // 1. Create product (with empty or given category)
    const created = await this.prisma.product.create({
      data: {
        ...createProductDto,
        tags: createProductDto.tags?.join(',') || null,
        category: createProductDto.category || '',
      },
    });

    let finalProduct = created;

    // 2. If category was missing, call prediction API
    if (!createProductDto.category) {
      try {
        const payload = { product_ids: [created.id] };
        const response = await axios.put(
          'http://mini-inventory-alb-1479871564.us-east-1.elb.amazonaws.com/products/classify_batch',
          payload,
          { headers: { 'Content-Type': 'application/json' } },
        );
        // Example response: [{ category: "Electronics", id: 1 }]
        const predicted = Array.isArray(response.data) ? response.data[0]?.category : null;
        if (predicted) {
          // Update in DB
          await this.prisma.product.update({
            where: { id: created.id },
            data: { category: predicted },
          });
          // Refetch the updated product
          finalProduct = await this.prisma.product.findUnique({
            where: { id: created.id },
          }) || created;
        }
      } catch (error) {
        console.error('Prediction API failed:', error);
        // Category stays as is
      }
    }

    return finalProduct;
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id); // Throws if not found

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        tags: dto.tags?.join(',') || null,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Validate
    return this.prisma.product.delete({ where: { id } });
  }

  async filter(filters: FilterProductsDto) {
    const { category, minPrice, maxPrice, inStock } = filters;

    return this.prisma.product.findMany({
      where: {
        category,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        inStock,
      },
    });
  }

  async getTopNMostExpensive(n: number) {
    return this.prisma.product.findMany({
      orderBy: { price: 'desc' },
      take: n,
    });
  }

  async getProductsAddedLastNDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.prisma.product.findMany({
      where: {
        createdAt: {
          gte: date,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTotalInventoryValue(): Promise<number> {
    const products = await this.prisma.product.findMany();
    return products.reduce(
      (total, p) => total + Number(p.price) * Number(p.quantity ?? 0),
      0,
    );
  }

  async getAveragePrice(): Promise<number> {
    const products = await this.prisma.product.findMany();
    if (products.length === 0) return 0;
    const totalValue = products.reduce(
      (total, p) => total + Number(p.price) * Number(p.quantity ?? 0),
      0,
    );
    return totalValue / products.length;
  }


  async searchByNameSimilarity(name: string) {
    try {
      const response = await axios.post(
        'http://inventory-db-pg.c30m8mg6a413.us-east-1.rds.amazonaws.com/products/similarity_by_name',
        { name },
        { headers: { 'Content-Type': 'application/json' } },
      );
      return response.data;
    } catch (error) {
      console.error('Similarity API failed:', error);
      throw new HttpException(
        'Failed to search similar products by name',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
