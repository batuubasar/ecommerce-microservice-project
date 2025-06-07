import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log('API GATEWAY is running on TCP port 3000');
}
bootstrap();
