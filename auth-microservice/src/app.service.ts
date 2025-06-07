import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './utils/types';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { LoginDto, MICROSERVICES, USER_PATTERNS } from '@ecommerce/types';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @Inject(MICROSERVICES.USERS.name) private usersMicroservice: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    const user: UserDto = await firstValueFrom(
      this.usersMicroservice.send(
        { cmd: USER_PATTERNS.FindByEmail },
        { email },
      ),
    );

    if (!user || user.password !== password) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      const responseUser = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
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
      throw new RpcException({
        statusCode: 401,
        message: 'Login failed',
      });
    }
  }

  verify(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (e) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }

  async me(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await firstValueFrom(
        this.usersMicroservice.send(
          { cmd: USER_PATTERNS.FindOne },
          { id: decoded.sub },
        ),
      );

      const responseUser = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      const newPayload: JwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        token: this.jwtService.sign(newPayload),
        user: responseUser,
      };
    } catch (e) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }
}
