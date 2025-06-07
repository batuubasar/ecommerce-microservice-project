import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { MICROSERVICES } from '@ecommerce/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OwnerOfProductGuard } from 'src/common/guards/owner-of-product.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.PRODUCTS.host,
          port: MICROSERVICES.PRODUCTS.port,
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
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard, RolesGuard, OwnerOfProductGuard],
})
export class ProductsModule {}
