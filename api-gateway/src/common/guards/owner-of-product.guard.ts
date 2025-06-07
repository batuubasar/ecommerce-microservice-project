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
import { UserRole, PRODUCT_PATTERNS, MICROSERVICES } from '@ecommerce/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OwnerOfProductGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MICROSERVICES.PRODUCTS.name)
    private readonly productsClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const productId = Number(request.params.id);

    if (!user) throw new ForbiddenException('Kullanıcı doğrulanamadı');

    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Admin role varsa izin ver
    if (allowedRoles?.includes(user.role)) {
      if (user.role === UserRole.ADMIN) return true;
    }

    // Ürün bilgilerini mikroservisten çek
    const product = await firstValueFrom(
      this.productsClient.send({ cmd: PRODUCT_PATTERNS.FindOne }, productId),
    );

    if (product?.sellerId === user.id) return true;

    throw new ForbiddenException('Bu ürünü yönetme yetkiniz yok.');
  }
}
