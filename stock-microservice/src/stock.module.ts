import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTS_HOST || 'products-microservice',
          port: parseInt(process.env.PRODUCTS_PORT || '3022'),
        },
      },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
