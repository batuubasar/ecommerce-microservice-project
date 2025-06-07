import {
  MICROSERVICES,
  PaginationOptions,
  PRODUCT_PATTERNS,
  UpdateProductDto,
} from '@ecommerce/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(MICROSERVICES.PRODUCTS.name)
    private readonly productsMicroservice: ClientProxy,
  ) {}

  create(dto: CreateProductDto) {
    return this.productsMicroservice.send(
      { cmd: PRODUCT_PATTERNS.Create },
      dto,
    );
  }

  findAll(pagination: PaginationOptions) {
    return this.productsMicroservice.send(
      { cmd: PRODUCT_PATTERNS.FindAll },
      pagination,
    );
  }

  findOne(id: number) {
    return this.productsMicroservice.send(
      { cmd: PRODUCT_PATTERNS.FindOne },
      id,
    );
  }

  update(id: number, dto: UpdateProductDto) {
    return this.productsMicroservice.send(
      { cmd: PRODUCT_PATTERNS.Update },
      { id, updateProductDto: dto },
    );
  }

  remove(id: number) {
    return this.productsMicroservice.send({ cmd: PRODUCT_PATTERNS.Remove }, id);
  }

  findBySeller(sellerId: number) {
    return this.productsMicroservice.send(
      { cmd: PRODUCT_PATTERNS.FindBySeller },
      sellerId,
    );
  }
}
