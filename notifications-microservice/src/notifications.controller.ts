import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { ORDER_EVENTS, OrderCreatedEvent } from '@ecommerce/types';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(ORDER_EVENTS.ORDER_CREATED)
  async handleOrderCreated(@Payload() message: any) {
    const data: OrderCreatedEvent = message.value
      ? JSON.parse(message.value)
      : message;

    await this.notificationsService.sendOrderNotification(data);
  }
}
