import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CartDocument = Cart & Document;

export class CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: string;
  @Prop({
    type: [
      {
        productId: String,
        quantity: Number,
        name: String,
        price: Number,
      },
    ],
  })
  items: CartItem[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);
