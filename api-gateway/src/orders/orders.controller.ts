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
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaginationOptions, UpdateOrderDto, UserRole } from '@ecommerce/types';
import { OwnerOfOrderGuard } from 'src/common/guards/owner-of-order.guard';
import { RequestWithUser } from 'src/common/utils/types';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('addOrder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.SELLER)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query() query: PaginationOptions) {
    return this.ordersService.findAll(query);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.USER, UserRole.SELLER, UserRole.ADMIN)
  findMyOrders(@Req() req: RequestWithUser) {
    return this.ordersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnerOfOrderGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, OwnerOfOrderGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerOfOrderGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
