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