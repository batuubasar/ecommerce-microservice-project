import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES, PRODUCT_PATTERNS } from '@ecommerce/types';

@Injectable()
export class StockService {
  constructor(
    @Inject(MICROSERVICES.PRODUCTS.name)
    private readonly productsClient: ClientProxy,
  ) {}

  async decreaseStock(items: { productId: number; quantity: number }[]) {
    for (const item of items) {
      if (item.quantity <= 0) {
        console.warn(
          `[StockService] Geçersiz stok miktarı: Product ID ${item.productId}, Quantity: ${item.quantity}`,
        );
        continue;
      }

      try {
        await firstValueFrom(
          this.productsClient.send({ cmd: PRODUCT_PATTERNS.Decrease }, item),
        );
        console.log(
          `[StockService] Stok düşürüldü: Product ID ${item.productId}, Quantity: ${item.quantity}`,
        );
      } catch (error) {
        console.error(
          `[StockService] Hata: Stok düşürülemedi | Product ID ${item.productId}`,
          error?.message || error,
        );
        throw new RpcException({
          statusCode: 500,
          message: `Stok düşürme işlemi başarısız: Product ID ${item.productId}`,
        });
      }
    }
  }
}
