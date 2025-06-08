import {
  MICROSERVICES,
  PaginationOptions,
  PRODUCT_PATTERNS,
  UpdateProductDto,
} from '@ecommerce/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject as InjectCache } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(MICROSERVICES.PRODUCTS.name)
    private readonly productsMicroservice: ClientProxy,
    @InjectCache(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto) {
    const result = await firstValueFrom(
      this.productsMicroservice.send({ cmd: PRODUCT_PATTERNS.Create }, dto),
    );

    await this.cacheManager.del('products:all:{"page":1,"limit":10}');
    return result;
  }

  async findAll(pagination: PaginationOptions) {
    const cacheKey = `products:all:${JSON.stringify(pagination)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await firstValueFrom(
      this.productsMicroservice.send(
        { cmd: PRODUCT_PATTERNS.FindAll },
        pagination,
      ),
    );

    await this.cacheManager.set(cacheKey, data, 600);
    return data;
  }

  async findOne(id: number) {
    const cacheKey = `products:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await firstValueFrom(
      this.productsMicroservice.send({ cmd: PRODUCT_PATTERNS.FindOne }, id),
    );

    await this.cacheManager.set(cacheKey, data, 600);
    return data;
  }

  async update(id: number, dto: UpdateProductDto) {
    const updated = await firstValueFrom(
      this.productsMicroservice.send(
        { cmd: PRODUCT_PATTERNS.Update },
        { id, updateProductDto: dto },
      ),
    );

    await this.cacheManager.del(`products:${id}`);
    await this.cacheManager.del('products:all:{"page":1,"limit":10}');
    return updated;
  }

  async remove(id: number) {
    const deleted = await firstValueFrom(
      this.productsMicroservice.send({ cmd: PRODUCT_PATTERNS.Remove }, id),
    );

    await this.cacheManager.del(`products:${id}`);
    await this.cacheManager.del('products:all:{"page":1,"limit":10}');
    return deleted;
  }

  async findBySeller(sellerId: number) {
    return firstValueFrom(
      this.productsMicroservice.send(
        { cmd: PRODUCT_PATTERNS.FindBySeller },
        sellerId,
      ),
    );
  }
}
