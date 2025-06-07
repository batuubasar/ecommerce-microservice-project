import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { MICROSERVICES } from '@ecommerce/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OwnerOfOrderGuard } from 'src/common/guards/owner-of-order.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.ORDERS.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.ORDERS.host,
          port: MICROSERVICES.ORDERS.port,
        },
      },
      {
        name: MICROSERVICES.AUTH.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.AUTH.host,
          port: MICROSERVICES.AUTH.port,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtAuthGuard, RolesGuard, OwnerOfOrderGuard],
})
export class OrdersModule {}
