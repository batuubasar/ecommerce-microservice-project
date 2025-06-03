import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@ecommerce/types';

@Controller()
export class AppController {
  constructor(private readonly authService: AppService) {}

  @MessagePattern({ cmd: AUTH_PATTERNS.Login })
  login(@Payload() data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: AUTH_PATTERNS.Verify })
  verify(@Payload() token: string) {
    return this.authService.verify(token);
  }
}
