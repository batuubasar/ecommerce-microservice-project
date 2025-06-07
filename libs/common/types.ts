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

export const ORDER_EVENTS={
  ORDER_CREATED:'order_created',
  ORDER_SHIPPING_CREATED:'order_shipping_created',
  ORDER_STOCK_WARNING:'stock_warning',
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
