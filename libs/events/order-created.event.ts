export class OrderCreatedEvent {
  orderId: number;
  userId: number;
  totalPrice: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
