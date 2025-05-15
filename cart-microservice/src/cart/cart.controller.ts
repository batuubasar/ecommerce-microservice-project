import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'addToCart' })
  addToCart(@Payload() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @MessagePattern({ cmd: 'getCart' })
  getCart(@Payload() userId: string) {
    return this.cartService.getCart(userId);
  }

  @MessagePattern({ cmd: 'updateCart' })
  updateCart(@Payload() dto: UpdateCartDto) {
    return this.cartService.updateCart(dto);
  }

  @MessagePattern({ cmd: 'removeItem' })
  removeItem(@Payload() payload: { userId: string; productId: string }) {
    return this.cartService.removeFromCart(payload.userId, payload.productId);
  }

  @MessagePattern({ cmd: 'clearCart' })
  clearCart(@Payload() userId: string) {
    return this.cartService.clearCart(userId);
  }
}
