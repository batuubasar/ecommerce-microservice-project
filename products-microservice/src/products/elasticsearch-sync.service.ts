import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './entities/product.entity';

@Injectable()
export class ElasticsearchSyncService implements OnModuleInit {
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    const indexExists = await this.esService.indices.exists({
      index: 'products',
    });
    if (!indexExists) {
      await this.esService.indices.create({
        index: 'products',
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            stock: { type: 'integer' },
            isActive: { type: 'boolean' },
            sellerId: { type: 'integer' },
            images: { type: 'keyword' },
          },
        },
      });
    }
  }

  async indexProduct(product: Product): Promise<void> {
    await this.esService.index({
      index: 'products',
      id: product.id.toString(),
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: +product.price,
        stock: product.stock,
        isActive: product.isActive,
        sellerId: product.sellerId,
        images: product.images?.map((img) => img.url) ?? [],
      },
    });
  }

  async removeProduct(productId: number): Promise<void> {
    await this.esService.delete({
      index: 'products',
      id: productId.toString(),
    });
  }
}
