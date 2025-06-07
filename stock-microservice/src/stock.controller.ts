import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { OrderCreatedEvent } from '@ecommerce/types';
import { ORDER_EVENTS } from '@ecommerce/types';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @EventPattern(ORDER_EVENTS.ORDER_CREATED)
  async handleOrderCreated(@Payload() payload: OrderCreatedEvent) {
    await this.stockService.decreaseStock(payload.items);
  }
}
