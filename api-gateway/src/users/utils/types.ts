export const USER_PATTERNS = {
  FindAll: 'Users.FindAll',
  FindOne: 'Users.FindOne',
  FindByEmail: 'Users.ByEmail',
  Create: 'Users.Create',
  Update: 'Users.Update',
  Remove: 'Users.Remove',
};
// SONRA GLOBALE ALINACAK
export type SortOrder = 'asc' | 'desc';
export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
