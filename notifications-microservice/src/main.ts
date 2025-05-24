import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          clientId: process.env.KAFKA_CLIENT_ID || 'notifications',
        },
        consumer: {
          groupId:
            process.env.KAFKA_CONSUMER_GROUP_ID || 'notification-consumer',
        },
      },
    },
  );
  await app.listen();
  console.log('Notifications microservice listening for Kafka events.');
}
bootstrap();
