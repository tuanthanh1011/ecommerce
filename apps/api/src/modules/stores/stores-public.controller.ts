import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { StoresService } from './stores.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Public()
@ApiTags('public-stores')
@Controller('public/stores')
export class StoresPublicController {
  constructor(private storesService: StoresService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.storesService.findAll(query, true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOneOrFail(id);
  }
}
