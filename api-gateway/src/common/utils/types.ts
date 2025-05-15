export const USER_PATTERNS = {
  FindAll: 'Users.FindAll',
  FindOne: 'Users.FindOne',
  FindByEmail: 'Users.FindByEmail',
  Create: 'Users.Create',
  Update: 'Users.Update',
  Remove: 'Users.Remove',
};
export const PRODUCT_PATTERNS = {
  FindAll: 'Products.FindAll',
  FindOne: 'Products.FindOne',
  FindBySeller: 'Products.FindBySeller',
  Create: 'Products.Create',
  Update: 'Products.Update',
  Remove: 'Products.Remove',
};
export type SortOrder = 'asc' | 'desc';
export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};

export class PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
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
