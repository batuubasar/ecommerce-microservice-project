import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PRODUCTS_POSTGRES_HOST'),
        port: config.get<number>('PRODUCTS_POSTGRES_PORT'),
        username: config.get<string>('PRODUCTS_POSTGRES_USER'),
        password: config.get<string>('PRODUCTS_POSTGRES_PASSWORD'),
        database: config.get<string>('PRODUCTS_POSTGRES_DB'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [__dirname + '/**/entities/*.entity.ts'],
        logging: true,
        cache: { duration: config.get<number>('TYPEORM_CACHE_DURATION') },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
