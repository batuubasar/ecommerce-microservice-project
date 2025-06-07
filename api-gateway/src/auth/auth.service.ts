import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS, LoginDto, MICROSERVICES } from '@ecommerce/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MICROSERVICES.AUTH.name)
    private readonly authMicroservice: ClientProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authMicroservice.send({ cmd: AUTH_PATTERNS.Login }, loginDto);
  }

  me(token: string) {
    return this.authMicroservice.send({ cmd: AUTH_PATTERNS.Me }, token);
  }
}
