import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './utils/types';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @Inject('USERS_MICROSERVICE') private usersMicroservice: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    const user: UserDto = await firstValueFrom(
      this.usersMicroservice.send(
        {
          cmd: 'Users.FindByEmail',
        },
        { email },
      ),
    );

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      const responseUser = new UserResponseDto(user);

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      return {
        token: this.jwtService.sign(payload),
        user: responseUser,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
