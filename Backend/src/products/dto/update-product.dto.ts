import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) { }

// Note: This DTO extends CreateProductDto, making all fields optional for updates.
// This allows you to update only the fields you want without needing to provide all fields again.
// The PartialType utility from @nestjs/mapped-types automatically makes all properties optional.
// This is useful for PATCH requests where you might not want to update every field of the product.
// Example usage:
// const updateProductDto = new UpdateProductDto();
// updateProductDto.name = 'Updated Product Name'; // Only updating the name field
// updateProductDto.price = 19.99; // Updating the price field
// This way, you can send a request to update only the specified fields without needing to resend the entire product object.
// This approach is efficient and aligns with RESTful principles, allowing for partial updates to resources.
// Ensure that the UpdateProductDto is used in your ProductsController for handling update requests.
