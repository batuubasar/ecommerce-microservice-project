import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
// validator sırasında hata verdiği için ya validator silecektim ya da çoklayacaktım 2 tane oldugundan bunu tercih ettim
export class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  index?: number;
}
