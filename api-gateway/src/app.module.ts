import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
@Module({
  imports: [UsersModule, AuthModule, ProductsModule, OrdersModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
