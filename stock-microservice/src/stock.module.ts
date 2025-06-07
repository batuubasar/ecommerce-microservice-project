import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { MICROSERVICES } from '@ecommerce/types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTS_HOST || MICROSERVICES.PRODUCTS.host,
          port: parseInt(process.env.PRODUCTS_PORT || '3022'),
        },
      },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
