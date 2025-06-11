import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ProductSearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async search(keyword: string) {
    const result = await this.esService.search({
      index: 'products',
      query: {
        multi_match: {
          query: keyword,
          fields: ['name^3', 'description'],
          fuzziness: 'AUTO',
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  }
}
