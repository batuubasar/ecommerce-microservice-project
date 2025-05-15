export const PRODUCT_PATTERNS = {
  FindAll: 'Products.FindAll',
  FindOne: 'Products.FindOne',
  FindBySeller: 'Products.FindBySeller',
  Create: 'Products.Create',
  Update: 'Products.Update',
  Remove: 'Products.Remove',
};

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
