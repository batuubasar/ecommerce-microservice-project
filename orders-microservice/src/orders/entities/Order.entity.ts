import { Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity, OrderResponseDto } from '@ecommerce/types';

@Entity('orders')
export class Order extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  constructor(dto: Partial<Order>) {
    super();
    Object.assign(this, { ...dto });
  }

  toResponseDto(): OrderResponseDto {
    return {
      id: this.id,
      totalPrice: +this.totalPrice,
      userId: this.userId,
      items: this.items?.map((item) => item.toResponseDto()) ?? [],
    };
  }
}
