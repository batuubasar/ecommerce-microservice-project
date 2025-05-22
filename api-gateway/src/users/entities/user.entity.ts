import { UserRole } from '@ecommerce/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: false })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  birthdate: Date;

  @Column({ name: 'is_active', type: 'boolean', unique: false, default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  constructor(dto: Partial<User>) {
    Object.assign(this, { ...dto });
  }
}
