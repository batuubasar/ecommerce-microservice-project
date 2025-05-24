import { NestFactory } from '@nestjs/core';
import { ShippingModule } from './shipping.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShippingModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          clientId: process.env.KAFKA_CLIENT_ID || 'shipping',
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'shipping-consumer',
        },
      },
    },
  );
  await app.listen();
  console.log('Shipping microservice listening to Kafka events!');
}
bootstrap();
