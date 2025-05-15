import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductImage } from './entities/product-image.entity';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult, PaginationOptions, SortOrder } from './utils/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
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

    return plainToInstance(ProductResponseDto, saved, {
      excludeExtraneousValues: true,
    });
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

    const data = plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });

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
    return plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updated = Object.assign(product, dto);
    const saved = await this.productRepository.save(updated);

    return plainToInstance(ProductResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: `Product with id ${id} deleted successfully` };
  }
}
