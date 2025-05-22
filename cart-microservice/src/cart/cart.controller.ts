import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto, CART_PATTERNS, UpdateCartDto } from '@ecommerce/types';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: CART_PATTERNS.AddToCart })
  addToCart(@Payload() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @MessagePattern({ cmd: CART_PATTERNS.GetCart })
  getCart(@Payload() userId: string) {
    return this.cartService.getCart(userId);
  }

  @MessagePattern({ cmd: CART_PATTERNS.UpdateCart })
  updateCart(@Payload() dto: UpdateCartDto) {
    return this.cartService.updateCart(dto);
  }

  @MessagePattern({ cmd: CART_PATTERNS.RemoveItem })
  removeItem(@Payload() payload: { userId: string; productId: string }) {
    return this.cartService.removeFromCart(payload.userId, payload.productId);
  }

  @MessagePattern({ cmd: CART_PATTERNS.ClearCart })
  clearCart(@Payload() userId: string) {
    return this.cartService.clearCart(userId);
  }
}
