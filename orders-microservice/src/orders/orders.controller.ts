import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  ORDER_PATTERNS,
  PaginationOptions,
  UpdateOrderDto,
} from '@ecommerce/types';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: ORDER_PATTERNS.Create })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
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
}
