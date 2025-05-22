import { Column, Entity } from 'typeorm';
import {
  BaseEntityWithName,
  UserResponseDto,
  UserRole,
} from '@ecommerce/types';

@Entity('users')
export class User extends BaseEntityWithName {
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
    super();
    Object.assign(this, { ...dto });
  }

  // plaintoinstance hata verince buna geçtik
  toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      birthdate: this.birthdate,
      role: this.role,
    };
  }
}
