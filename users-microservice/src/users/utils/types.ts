export const USER_PATTERNS = {
  FindAll: 'Users.FindAll',
  FindOne: 'Users.FindOne',
  FindByEmail: 'Users.ByEmail',
  Create: 'Users.Create',
  Update: 'Users.Update',
  Remove: 'Users.Remove',
};

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
  GUEST = 'GUEST',
}
// SONRA GLOBALE ALINACAK
export type SortOrder = 'asc' | 'desc';
export class PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
