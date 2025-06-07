import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShippingService } from './shipping.service';
import { ORDER_EVENTS, OrderCreatedEvent } from '@ecommerce/types';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @EventPattern(ORDER_EVENTS.ORDER_CREATED)
  handleOrderCreated(@Payload() message: any) {
    const data: OrderCreatedEvent = message.value
      ? JSON.parse(message.value)
      : message;
    this.shippingService.createShipping(data.orderId, data.userId);
  }
}
