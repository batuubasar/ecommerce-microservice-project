import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult, PaginationOptions } from 'utils/types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepository: Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = this.orderRepository.create({
      userId: dto.userId,
      totalPrice: dto.totalPrice,
    });
    const savedOrder = await this.orderRepository.save(order);

    const items = dto.orderItems.map((i) => {
      return this.itemRepository.create({
        order: savedOrder,
        productId: i.productId,
        quantity: i.quantity,
        price: i.unitPrice,
        totalPrice: i.totalPrice,
      });
    });

    const savedItems = await this.itemRepository.save(items);
    savedOrder.items = savedItems;
    return plainToInstance(OrderResponseDto, savedOrder, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    params: PaginationOptions,
  ): Promise<PaginatedResult<OrderResponseDto>> {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      order: { [params.sort || 'id']: params.order || 'ASC' },
    });
    return {
      data: plainToInstance(OrderResponseDto, orders, {
        excludeExtraneousValues: true,
      }),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    if (dto.totalPrice) order.totalPrice = dto.totalPrice;

    if (dto.orderItems) {
      await this.itemRepository.remove(order.items);
      const newItems = dto.orderItems.map((item) =>
        this.itemRepository.create({
          order,
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
          totalPrice: item.totalPrice,
        }),
      );
      order.items = await this.itemRepository.save(newItems);
    }

    const updated = await this.orderRepository.save(order);
    return plainToInstance(OrderResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.orderRepository.delete(id);
    if (deleted.affected === 0)
      throw new NotFoundException(`Order ${id} not found`);
    return { message: `Order ${id} deleted successfully` };
  }
}
