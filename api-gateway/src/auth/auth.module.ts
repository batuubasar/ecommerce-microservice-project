import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES } from '@ecommerce/types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.AUTH.name,
        transport: Transport.TCP,
        options: {
          port: MICROSERVICES.AUTH.port,
          host: MICROSERVICES.AUTH.host,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
