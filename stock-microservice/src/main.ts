import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StockModule } from './stock.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StockModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          clientId: process.env.KAFKA_CLIENT_ID || 'stock',
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'stock-consumer',
        },
      },
    },
  );

  await app.listen();
  console.log('Stock microservice Kafka üzerinden dinleniyor!');
}
bootstrap();
