import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../utils/types';
import { UserRole, ORDER_PATTERNS, MICROSERVICES } from '@ecommerce/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OwnerOfOrderGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MICROSERVICES.ORDERS.name)
    private readonly ordersClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const orderId = Number(request.params.id);

    if (!user) throw new ForbiddenException('Kullanıcı doğrulanamadı');

    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowedRoles?.includes(user.role)) {
      if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)
        return true;
    }

    const order = await firstValueFrom(
      this.ordersClient.send({ cmd: ORDER_PATTERNS.FindOne }, orderId),
    );

    if (order?.userId === user.id) return true;

    throw new ForbiddenException('Bu sipariş size ait değil.');
  }
}
