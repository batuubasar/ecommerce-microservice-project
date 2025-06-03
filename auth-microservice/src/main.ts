import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MICROSERVICES } from '@ecommerce/types';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: MICROSERVICES.AUTH.port,
      },
    },
  );
  await app.listen();
  console.log('Auth microservice is running on 3021.');
}
bootstrap();
