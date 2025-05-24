import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  userId: number;

  @Column()
  status: string;

  @Column()
  estimatedDelivery: string;
}
