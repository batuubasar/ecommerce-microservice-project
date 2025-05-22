import { Exclude, Expose, Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-image-response.dto';
export class ProductResponseDto {
  id: number;

  name: string;

  description: string;

  price: number;

  stock: number;

  isActive: boolean;

  sellerId: number;

  @Type(() => ProductImageResponseDto)
  images: ProductImageResponseDto[];
}
