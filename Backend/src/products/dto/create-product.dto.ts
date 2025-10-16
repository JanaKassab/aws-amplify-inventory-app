import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Wireless Mouse',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  inStock: boolean;

  @ApiPropertyOptional({ example: 'Portable and loud' })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
