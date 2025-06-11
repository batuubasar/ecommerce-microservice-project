import { Controller, Get, Query } from '@nestjs/common';
import { ProductSearchService } from './product-search.service';

@Controller('products/search')
export class ProductSearchController {
  constructor(private readonly searchService: ProductSearchService) {}

  @Get()
  async search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}
