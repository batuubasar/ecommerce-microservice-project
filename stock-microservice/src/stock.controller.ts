import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { OrderCreatedEvent } from '@ecommerce/types';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() payload: OrderCreatedEvent) {
    await this.stockService.decreaseStock(payload.items);
  }
}
