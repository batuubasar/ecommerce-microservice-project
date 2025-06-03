import { AUTH_PATTERNS, MICROSERVICES } from '@ecommerce/types';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(MICROSERVICES.AUTH.name) private authMicroservice: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await firstValueFrom(
        this.authMicroservice.send({ cmd: AUTH_PATTERNS.Verify }, token),
      );
      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
