import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'products-microservice',
          port: 3022,
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
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard],
})
export class ProductsModule {}
