import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CART_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'cart-microservice',
          port: 3024,
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
  controllers: [CartController],
  providers: [CartService, JwtAuthGuard],
})
export class CartModule {}
