import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from '@ecommerce/types';

@Injectable()
export class NotificationsService {
  sendOrderNotification(event: OrderCreatedEvent) {
    console.log('Sipariş bildirimi işleniyor!');
    console.log(`Sipariş ID: ${event.orderId}`);
    console.log(`Kullanıcı ID: ${event.userId}`);
    console.log(`Toplam Tutar: ${event.totalPrice}₺`);
    console.log('Ürünler:');
    event.items.forEach((item) => {
      console.log(`-Ürün ID: ${item.productId}, Adet: ${item.quantity}`);
    });
  }
}
