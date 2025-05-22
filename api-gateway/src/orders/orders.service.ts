import {
  CreateOrderDto,
  ORDER_PATTERNS,
  PaginationOptions,
  UpdateOrderDto,
} from '@ecommerce/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_MICROSERVICE')
    private readonly ordersMicroservice: ClientProxy,
  ) {}

  create(dto: CreateOrderDto) {
    return this.ordersMicroservice.send({ cmd: ORDER_PATTERNS.Create }, dto);
  }

  findAll(pagination: PaginationOptions) {
    return this.ordersMicroservice.send(
      { cmd: ORDER_PATTERNS.FindAll },
      pagination,
    );
  }

  findOne(id: number) {
    return this.ordersMicroservice.send({ cmd: ORDER_PATTERNS.FindOne }, id);
  }

  update(id: number, dto: UpdateOrderDto) {
    return this.ordersMicroservice.send(
      { cmd: ORDER_PATTERNS.Update },
      { id, updateOrderDto: dto },
    );
  }

  remove(id: number) {
    return this.ordersMicroservice.send({ cmd: ORDER_PATTERNS.Remove }, id);
  }
}
