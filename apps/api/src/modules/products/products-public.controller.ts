import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ProductsService } from './products.service';
import { ProductsQueryDto } from './dto/products-query.dto';

@Public()
@ApiTags('public-products')
@Controller('public/products')
export class ProductsPublicController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductsQueryDto) {
    return this.productsService.findAll(query, true);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findPublicOrFail(id);
  }
}
