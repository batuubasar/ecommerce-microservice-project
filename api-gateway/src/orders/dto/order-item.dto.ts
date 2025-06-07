import { IsNotEmpty, IsNumber } from 'class-validator';

// validator sırasında hata verdiği için ya validator silecektim ya da çoklayacaktım 2 tane oldugundan bunu tercih ettim
export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
