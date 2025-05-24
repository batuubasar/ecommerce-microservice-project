import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCreatedEvent } from '@ecommerce/types';
import { Shipping } from './entities/shipping.entity';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
  ) {}

  async createShippingRecord(event: OrderCreatedEvent) {
    const shipping = this.shippingRepository.create({
      orderId: event.orderId,
      userId: event.userId,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
    });

    const saved = await this.shippingRepository.save(shipping);
    console.log('Kargo kaydı oluşturuldu:', saved);
  }
}
