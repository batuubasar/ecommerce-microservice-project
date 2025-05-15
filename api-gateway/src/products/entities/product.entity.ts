import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'seller_id', type: 'int' })
  sellerId: number;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  constructor(dto: Partial<Product>) {
    Object.assign(this, { ...dto });
  }
}
