import { Exclude, Expose, Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-image-response.dto';
@Exclude()
export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  isActive: boolean;

  @Expose()
  sellerId: number;

  @Expose()
  @Type(() => ProductImageResponseDto)
  images: ProductImageResponseDto[];
}
