import { UserRole } from '@ecommerce/types';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
};
