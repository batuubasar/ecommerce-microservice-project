import { AddToCartDto, CART_PATTERNS, UpdateCartDto } from '@ecommerce/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_MICROSERVICE')
    private readonly cartClient: ClientProxy,
  ) {}

  addToCart(dto: AddToCartDto) {
    return this.cartClient.send({ cmd: CART_PATTERNS.AddToCart }, dto);
  }

  getCart(userId: string) {
    return this.cartClient.send({ cmd: CART_PATTERNS.GetCart }, userId);
  }

  updateCart(dto: UpdateCartDto) {
    return this.cartClient.send({ cmd: CART_PATTERNS.UpdateCart }, dto);
  }

  removeItem(userId: string, productId: string) {
    return this.cartClient.send(
      { cmd: CART_PATTERNS.RemoveItem },
      { userId, productId },
    );
  }

  clearCart(userId: string) {
    return this.cartClient.send({ cmd: CART_PATTERNS.ClearCart }, userId);
  }
}
