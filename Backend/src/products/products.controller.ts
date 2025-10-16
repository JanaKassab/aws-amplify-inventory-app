import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')

export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('CreateProduct')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter products by query parameters' })
  @ApiResponse({ status: 200, description: 'Filtered list of products' })
  filter(@Query() filters: FilterProductsDto) {
    return this.productsService.filter(filters);
  }
  @Get('FindAll')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('FindOne/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the product to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('FindTotalInventoryValue')
  @ApiOperation({ summary: 'Get the total inventory value' })
  @ApiResponse({
    status: 200,
    description: 'Total inventory value of all products',
  })
  getTotalInventoryValue() {
    return this.productsService.getTotalInventoryValue();
  }

  @Get('FindAverageProductPrice')
  @ApiOperation({ summary: 'Get the average product price' })
  @ApiResponse({
    status: 200,
    description: 'Average of all products',
  })
  getAveragePrice() {
    return this.productsService.getAveragePrice();
  }

  @Get('GetTopNExpensiveProducts/:N')
  @ApiOperation({ summary: 'Get top N expensive products' })
  @ApiParam({
    name: 'N',
    type: Number,
    description: 'Number of top expensive products to return',
  })
  @ApiResponse({ status: 200, description: 'List of all products' })
  getTopNMostExpensive(@Param('N', ParseIntPipe) N: number) {
    return this.productsService.getTopNMostExpensive(N);
  }

  @Get('GetProductsAddedinLastNDays/:N')
  @ApiOperation({ summary: 'Get Products Added in Last N Days' })
  @ApiParam({
    name: 'N',
    type: Number,
    description: 'Number of days to look back for products',
  })
  @ApiResponse({ status: 200, description: 'List of all products' })
  getProductsAddedLastNDays(@Param('N', ParseIntPipe) N: number) {
    return this.productsService.getProductsAddedLastNDays(N);
  }

  @Patch('UpdateProduct/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('DeleteProduct/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post('search-similarity')
  async searchByName(@Body('name') name: string) {
    return this.productsService.searchByNameSimilarity(name);
  }

}
