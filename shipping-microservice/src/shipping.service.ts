import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kafka, Producer } from 'kafkajs';
import { ShippingStatus } from '@ecommerce/types';
import { ORDER_EVENTS } from '@ecommerce/types';
import { Shipping } from './entities/shipping.entity';

@Injectable()
export class ShippingService implements OnModuleInit {
  private kafkaProducer: Producer;
  private kafkaAdmin;

  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
  ) {
    const kafka = new Kafka({
      clientId: 'shipping-server',
      brokers: ['kafka:9092'],
      connectionTimeout: 30000,
      retry: {
        retries: 8,
      },
    });

    this.kafkaProducer = kafka.producer();
    this.kafkaAdmin = kafka.admin();
  }

  async onModuleInit() {
    await this.kafkaProducer.connect();
    await this.kafkaAdmin.connect();

    await this.kafkaAdmin.createTopics({
      topics: [
        {
          topic: ORDER_EVENTS.ORDER_SHIPPING_CREATED,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    console.log(
      `Kafka topic "${ORDER_EVENTS.ORDER_SHIPPING_CREATED}" is ready.`,
    );

    await this.kafkaAdmin.disconnect();
  }

  async createShipping(orderId: number, userId: number): Promise<Shipping> {
    const now = new Date();
    const estimatedDeliveryDate = new Date(now.setDate(now.getDate() + 7));
    const estimatedDelivery = estimatedDeliveryDate.toISOString();

    const shipping = this.shippingRepository.create({
      orderId,
      userId,
      status: ShippingStatus.PENDING,
      estimatedDelivery,
    });

    await this.shippingRepository.save(shipping);
    console.log('Shipping saved:', shipping);

    await this.kafkaProducer.send({
      topic: ORDER_EVENTS.ORDER_SHIPPING_CREATED,
      messages: [
        {
          value: JSON.stringify({
            orderId,
            shippingStatus: ShippingStatus.PENDING,
            estimatedDelivery,
          }),
        },
      ],
    });

    return shipping;
  }
}
