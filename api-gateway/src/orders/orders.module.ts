import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'orders-microservice',
          port: 3023,
        },
      },
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-microservice',
          port: 3021,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtAuthGuard],
})
export class OrdersModule {}
