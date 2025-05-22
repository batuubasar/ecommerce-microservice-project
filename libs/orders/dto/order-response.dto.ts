import { Type } from 'class-transformer';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: number;

  totalPrice: number;

  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  userId: number;
}
