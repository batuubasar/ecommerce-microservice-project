import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from '@ecommerce/types';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '2525', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOrderNotification(event: OrderCreatedEvent) {
    console.log('Sipariş bildirimi işleniyor!');

    const itemsList = event.items
      .map((item) => `- Ürün ID: ${item.productId}, Adet: ${item.quantity}`)
      .join('\n');

    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@ecommerce.com',
      to: 'customer@example.com',
      subject: `Yeni Sipariş - ID: ${event.orderId}`,
      text: `
Sipariş Detayları:
Sipariş No: ${event.orderId}
Kullanıcı ID: ${event.userId}
Toplam Tutar: ${event.totalPrice}₺
Ürünler:
${itemsList}
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Mail gönderildi:', info.messageId);
    } catch (error) {
      console.error('Mail gönderim hatası:', error);
    }
  }
}
