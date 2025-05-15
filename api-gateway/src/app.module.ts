import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [UsersModule, AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
