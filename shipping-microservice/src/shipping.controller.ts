import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShippingService } from './shipping.service';
import { OrderCreatedEvent } from '@ecommerce/types';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() message: any) {
    const data: OrderCreatedEvent = message.value
      ? JSON.parse(message.value)
      : message;
    this.shippingService.createShippingRecord(data);
  }
}
