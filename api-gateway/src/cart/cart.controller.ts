import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { AddToCartDto, UpdateCartDto, UserResponseDto } from '@ecommerce/types';
@UseGuards(JwtAuthGuard) // tek tek her endpointe yapmak yerine burada tanımladım
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  add(@Body() dto: AddToCartDto, @Req() req) {
    dto.userId = String((req.user as UserResponseDto).id);
    return this.cartService.addToCart(dto);
  }

  @Get()
  get(@Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.getCart(userId);
  }

  @Put('update')
  update(@Body() dto: UpdateCartDto, @Req() req) {
    dto.userId = String((req.user as UserResponseDto).id);
    return this.cartService.updateCart(dto);
  }

  @Delete('clear')
  clear(@Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.clearCart(userId);
  }

  @Delete(':productId')
  remove(@Param('productId') productId: string, @Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.removeItem(userId, productId);
  }
}
