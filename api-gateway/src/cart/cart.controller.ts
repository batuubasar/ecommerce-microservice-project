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
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { AddToCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  add(@Body() dto: AddToCartDto, @Req() req) {
    dto.userId = String((req.user as UserResponseDto).id);
    return this.cartService.addToCart(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  get(@Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.getCart(userId);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateCartDto, @Req() req) {
    dto.userId = String((req.user as UserResponseDto).id);
    return this.cartService.updateCart(dto);
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  clear(@Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.clearCart(userId);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('productId') productId: string, @Req() req) {
    const userId = String((req.user as UserResponseDto).id);
    return this.cartService.removeItem(userId, productId);
  }
}
