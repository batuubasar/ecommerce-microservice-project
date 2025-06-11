import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/JwtAuthGuard.guard';
import { MICROSERVICES } from '@ecommerce/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OwnerOfProductGuard } from 'src/common/guards/owner-of-product.guard';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductSearchController } from './product-search.controller';
import { ProductSearchService } from './product-search.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.PRODUCTS.host,
          port: MICROSERVICES.PRODUCTS.port,
        },
      },
      {
        name: MICROSERVICES.AUTH.name,
        transport: Transport.TCP,
        options: {
          host: MICROSERVICES.AUTH.host,
          port: MICROSERVICES.AUTH.port,
        },
      },
    ]),
    ElasticsearchModule.register({ node: 'http://elasticsearch:9200' }),
  ],
  controllers: [ProductSearchController, ProductsController],
  providers: [
    ProductSearchService,
    ProductsService,
    JwtAuthGuard,
    RolesGuard,
    OwnerOfProductGuard,
  ],
})
export class ProductsModule {}
