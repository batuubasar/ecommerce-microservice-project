import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationOptions, PRODUCT_PATTERNS } from './utils/types';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: PRODUCT_PATTERNS.Create })
  create(@Payload() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @MessagePattern({ cmd: PRODUCT_PATTERNS.FindAll })
  findAll(@Payload() paginationParams: PaginationOptions) {
    return this.productsService.findAll(paginationParams);
  }

  @MessagePattern({ cmd: PRODUCT_PATTERNS.FindBySeller })
  findBySeller(@Payload() sellerId: number) {
    return this.productsService.findBySeller(sellerId);
  }

  @MessagePattern({ cmd: PRODUCT_PATTERNS.FindOne })
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: PRODUCT_PATTERNS.Update })
  update(
    @Payload() payload: { id: number; updateProductDto: UpdateProductDto },
  ) {
    return this.productsService.update(payload.id, payload.updateProductDto);
  }

  @MessagePattern({ cmd: PRODUCT_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.productsService.remove(id);
  }
}
