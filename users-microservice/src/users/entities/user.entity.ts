import { Column, Entity } from 'typeorm';
import { UserRole } from '../utils/types';
import { BaseEntityWithName } from './BaseEntityWithName';

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
}
