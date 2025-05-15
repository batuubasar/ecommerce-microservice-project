import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
    eager: true,
  })
  items: OrderItem[];

  constructor(dto: Partial<Order>) {
    Object.assign(this, { ...dto });
  }
}
