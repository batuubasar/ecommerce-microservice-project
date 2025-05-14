import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly authService: AppService) {}

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'auth.verify' })
  verify(@Payload() token: string) {
    return this.authService.verify(token);
  }
}
