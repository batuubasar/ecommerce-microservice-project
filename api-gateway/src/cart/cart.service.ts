import { Inject, Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AddToCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_MICROSERVICE')
    private readonly cartClient: ClientProxy,
  ) {}

  addToCart(dto: AddToCartDto) {
    return this.cartClient.send({ cmd: 'addToCart' }, dto);
  }

  getCart(userId: string) {
    return this.cartClient.send({ cmd: 'getCart' }, userId);
  }

  updateCart(dto: UpdateCartDto) {
    return this.cartClient.send({ cmd: 'updateCart' }, dto);
  }

  removeItem(userId: string, productId: string) {
    return this.cartClient.send({ cmd: 'removeItem' }, { userId, productId });
  }

  clearCart(userId: string) {
    return this.cartClient.send({ cmd: 'clearCart' }, userId);
  }
}
