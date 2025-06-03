import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { AUTH_PATTERNS, MICROSERVICES } from '@ecommerce/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MICROSERVICES.AUTH.name)
    private readonly authMicroservice: ClientProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authMicroservice.send({ cmd: AUTH_PATTERNS.Login }, loginDto);
  }
}
