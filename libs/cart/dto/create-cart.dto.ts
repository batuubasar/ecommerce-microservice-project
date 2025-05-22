import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
