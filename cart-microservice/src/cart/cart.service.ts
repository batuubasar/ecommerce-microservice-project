import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model } from 'mongoose';
import { AddToCartDto, UpdateCartDto } from '@ecommerce/types';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async addToCart(dto: AddToCartDto) {
    const cart = await this.cartModel.findOne({ userId: dto.userId });

    if (!cart) {
      return this.cartModel.create({
        userId: dto.userId,
        items: [
          {
            productId: dto.productId,
            name: dto.name,
            price: dto.price,
            quantity: dto.quantity,
          },
        ],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === dto.productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += dto.quantity;
    } else {
      cart.items.push({
        productId: dto.productId,
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
      });
    }

    return cart.save();
  }

  async getCart(userId: string) {
    return this.cartModel.findOne({ userId });
  }

  async updateCart(dto: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ userId: dto.userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((item) => item.productId === dto.productId);
    if (!item) throw new NotFoundException('Product not found in cart');

    item.quantity = dto.quantity ?? item.quantity;
    item.price = dto.price ?? item.price;

    return cart.save();
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((item) => item.productId !== productId);
    return cart.save();
  }

  async clearCart(userId: string) {
    return this.cartModel.deleteOne({ userId });
  }
}
