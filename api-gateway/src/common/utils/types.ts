import { Request } from 'express';
export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
  params: {
    id: string;
  };
}
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
  GUEST = 'GUEST',
}
