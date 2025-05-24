import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/order-item.entity';
import {
  OrderCreatedEvent,
  OrderResponseDto,
  PaginatedResult,
  PaginationOptions,
  SortOrder,
} from '@ecommerce/types';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepository: Repository<OrderItem>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  async onModuleInit() {
    await this.kafkaClient.connect();
  }

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

    // eslint hatasi vardı sadece await olunca ondan dolayı firstvaluefrom observable'ı promise çevirip hatayı engelliyor diye kullandım
    await firstValueFrom(
      this.kafkaClient.emit<OrderCreatedEvent>('order_created', {
        orderId: savedOrder.id,
        userId: savedOrder.userId,
        totalPrice: savedOrder.totalPrice,
        items: savedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    );

    return savedOrder.toResponseDto();
  }

  async findAll(
    params: PaginationOptions = {} as PaginationOptions,
  ): Promise<PaginatedResult<OrderResponseDto>> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const sort = params.sort || 'id';
    const order = (params.order || 'ASC').toUpperCase() as SortOrder;
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: order },
    });

    const data = orders.map((order) => order.toResponseDto());

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order.toResponseDto();
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
    const result = await this.orderRepository.findOne({
      where: { id: updated.id },
      relations: ['items'],
    });
    if (!result) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return result.toResponseDto();
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.orderRepository.delete(id);
    if (deleted.affected === 0)
      throw new NotFoundException(`Order ${id} not found`);
    return { message: `Order ${id} deleted successfully` };
  }
}
