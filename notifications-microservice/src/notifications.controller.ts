import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { OrderCreatedEvent } from '@ecommerce/types';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() message: any) {
    const data: OrderCreatedEvent = message.value
      ? JSON.parse(message.value)
      : message;

    this.notificationsService.sendOrderNotification(data);
  }
}
