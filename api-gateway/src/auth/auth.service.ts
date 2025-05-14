import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authMicroservice: ClientProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authMicroservice.send({ cmd: 'auth.login' }, loginDto);
  }
}
