import { Column, Entity, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { BaseEntityWithName, ProductResponseDto } from '@ecommerce/types';

@Entity('products')
export class Product extends BaseEntityWithName {
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
    super();
    Object.assign(this, { ...dto });
  }

  toResponseDto(): ProductResponseDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: +this.price,
      stock: this.stock,
      isActive: this.isActive,
      sellerId: this.sellerId,
      images: this.images?.map((img) => img.toResponseDto()) ?? [],
    };
  }
}
