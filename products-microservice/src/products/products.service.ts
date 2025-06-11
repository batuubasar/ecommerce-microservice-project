import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import {
  PaginatedResult,
  PaginationOptions,
  ProductResponseDto,
  SortOrder,
  UpdateProductDto,
} from '@ecommerce/types';
import { RpcException } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { ElasticsearchSyncService } from './elasticsearch-sync.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject() private readonly esSyncService: ElasticsearchSyncService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const images = (dto.images || []).map((imgDto) => {
      const image = new ProductImage();
      image.url = imgDto.url;
      image.index = imgDto.index ?? 0;
      return image;
    });

    const product = this.productRepository.create({
      ...dto,
      images,
    });

    const saved = await this.productRepository.save(product);
    await this.esSyncService.indexProduct(saved);
    return saved.toResponseDto();
  }

  async findAll(
    params: PaginationOptions,
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = params;

    const [products, total] = await this.productRepository.findAndCount({
      order: { [sort]: order.toUpperCase() as SortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = products.map((p) => p.toResponseDto()); // plaintoinstance hata verince

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findBySeller(sellerId: number): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { sellerId },
    });
    return products.map((p) => p.toResponseDto());
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: `Product with id ${id} not found`,
      });
    }
    return product.toResponseDto();
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: `Product with id ${id} not found`,
      });
    }

    const updated = Object.assign(product, dto);
    const saved = await this.productRepository.save(updated);
    await this.esSyncService.indexProduct(saved);
    return saved.toResponseDto();
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new RpcException({
        statusCode: 404,
        message: `Product with id ${id} not found`,
      });
    }
    await this.esSyncService.removeProduct(id);
    return { message: `Product with id ${id} deleted successfully` };
  }

  async decreaseStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: `Product with id ${productId} not found`,
      });
    }
    if (product.stock < quantity) {
      console.warn(
        `Stok yetersiz! Product ID: ${productId}, Talep: ${quantity}, Mevcut: ${product.stock}`,
      );
      throw new RpcException({
        statusCode: 400,
        message: `Insufficient stock: requested ${quantity}, available ${product.stock}`,
      });
    }
    product.stock -= quantity;
    await this.productRepository.save(product);
  }

  async bulkIndexAllProductsToElastic(): Promise<{ indexed: number }> {
    const products = await this.productRepository.find({
      relations: ['images'],
    });

    for (const product of products) {
      await this.esSyncService.indexProduct(product);
    }

    return { indexed: products.length };
  }
}
