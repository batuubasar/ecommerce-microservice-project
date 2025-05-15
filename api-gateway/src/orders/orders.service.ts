import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_PATTERNS, PaginationOptions } from 'src/common/utils/types';

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
