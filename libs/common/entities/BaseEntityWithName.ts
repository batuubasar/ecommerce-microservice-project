import { Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export abstract class BaseEntityWithName extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;
}
