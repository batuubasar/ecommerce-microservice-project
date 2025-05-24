import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PRODUCT_PATTERNS } from '@ecommerce/types';

@Injectable()
export class StockService {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  async decreaseStock(items: { productId: number; quantity: number }[]) {
    for (const item of items) {
      if (item.quantity <= 0) {
        console.warn(`Stok miktarı hatalı: ${item.productId}`);
        continue;
      }
      await firstValueFrom(
        this.productsClient.send({ cmd: PRODUCT_PATTERNS.Decrease }, item),
      );
    }
  }
}
