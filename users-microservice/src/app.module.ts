import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('USERS_POSTGRES_HOST'),
        port: config.get<number>('USERS_POSTGRES_PORT'),
        username: config.get<string>('USERS_POSTGRES_USER'),
        password: config.get<string>('USERS_POSTGRES_PASSWORD'),
        database: config.get<string>('USERS_POSTGRES_DB'),
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
