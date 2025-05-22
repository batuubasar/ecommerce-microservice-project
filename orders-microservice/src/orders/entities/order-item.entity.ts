import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './Order.entity';
import { BaseEntity, OrderItemResponseDto } from '@ecommerce/types';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => Order, (order) => order.items, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  constructor(dto: Partial<OrderItem>) {
    super();
    Object.assign(this, { ...dto });
  }

  toResponseDto(): OrderItemResponseDto {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      price: +this.price,
      totalPrice: +this.totalPrice,
    };
  }
}
