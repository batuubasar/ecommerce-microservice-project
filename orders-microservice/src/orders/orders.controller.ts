import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import {
  ORDER_PATTERNS,
  PaginationOptions,
  UpdateOrderDto,
} from '@ecommerce/types';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemDto } from './dto/order-item.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: ORDER_PATTERNS.Create })
  async create(@Payload() dto: CreateOrderDto) {
    //libsden cekince orderitem işlemede sorun oluyordu mecbur boyle yaptım
    console.log('DTO type:', dto.orderItems[0] instanceof OrderItemDto); // false diyorsa sorun var

    return this.ordersService.create(dto);
  }

  @MessagePattern({ cmd: ORDER_PATTERNS.FindAll })
  findAll(@Payload() paginationParams: PaginationOptions) {
    return this.ordersService.findAll(paginationParams);
  }

  @MessagePattern({ cmd: ORDER_PATTERNS.FindOne })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: ORDER_PATTERNS.Update })
  update(@Payload() payload: { id: number; updateOrderDto: UpdateOrderDto }) {
    return this.ordersService.update(payload.id, payload.updateOrderDto);
  }

  @MessagePattern({ cmd: ORDER_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.ordersService.remove(id);
  }

  @MessagePattern({ cmd: ORDER_PATTERNS.FindByUserId })
  findByUser(@Payload() userId: number) {
    return this.ordersService.findByUserId(userId);
  }
}
