import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductImageResponseDto {
  @Expose()
  url: string;

  @Expose()
  index: number;
}
