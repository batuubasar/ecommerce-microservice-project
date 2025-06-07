import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { MICROSERVICES } from '@ecommerce/types';
import { OwnerOrRolesGuard } from 'src/common/guards/owner-or-roles.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.USERS.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.USERS.host,
          port: MICROSERVICES.USERS.port,
        },
      },
      {
        name: MICROSERVICES.AUTH.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.AUTH.host,
          port: MICROSERVICES.AUTH.port,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, OwnerOrRolesGuard, RolesGuard],
})
export class UsersModule {}
