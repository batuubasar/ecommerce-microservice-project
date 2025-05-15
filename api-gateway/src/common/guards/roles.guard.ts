import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from '../utils/types';
import { ROLES_KEY } from 'src/auth/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Yetkiniz bulunmamaktadır.');
    }
    return true;
  }
}
