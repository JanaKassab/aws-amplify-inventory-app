import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
// Import the Transform decorator
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductsDto {
    @ApiPropertyOptional({ example: 'Electronics' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @ApiPropertyOptional({ type: 'boolean', description: 'Filter by stock availability' })
    @IsOptional()
    // --- THIS IS THE FIX ---
    // We replace @Type(() => Boolean) with a custom @Transform.
    // This transform correctly parses the string "true" or "false" into a boolean.
    @Transform(({ value }) => {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        // Return the original value if it's neither 'true' nor 'false'
        // so that the @IsBoolean() validator can catch it as an error.
        return value;
    })
    @IsBoolean({ message: 'inStock must be a boolean value (true or false)' })
    inStock?: boolean;
}