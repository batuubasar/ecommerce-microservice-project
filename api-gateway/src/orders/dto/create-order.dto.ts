import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

// validator sırasında hata verdiği için ya validator silecektim ya da çoklayacaktım 2 tane oldugundan bunu tercih ettim
export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
