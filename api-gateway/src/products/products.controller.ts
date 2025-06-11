import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CapitalizeNamePipe } from 'src/common/pipes/capitalize-name.pipe';
import {
  PaginationOptions,
  UpdateProductDto,
  UserRole,
} from '@ecommerce/types';
import { CreateProductDto } from './dto/create-product.dto';
import { OwnerOfProductGuard } from 'src/common/guards/owner-of-product.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('addProduct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  create(@Body(CapitalizeNamePipe) dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get('all')
  findAll(@Query() query: PaginationOptions) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, OwnerOfProductGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerOfProductGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Get('/seller/:sellerId')
  findBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.productsService.findBySeller(sellerId);
  }

  @Post('sync-to-elastic')
  async syncToElastic() {
    return this.productsService.syncToElastic();
  }
}
