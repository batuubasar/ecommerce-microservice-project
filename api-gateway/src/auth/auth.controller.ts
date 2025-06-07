import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@ecommerce/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@Headers('Authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    return this.authService.me(token);
  }
}
