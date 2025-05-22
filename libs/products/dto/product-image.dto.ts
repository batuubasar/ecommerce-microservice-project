import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  index?: number;
}
