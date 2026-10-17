import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { JobsService } from './jobs.service';
import { JobsQueryDto } from './dto/jobs-query.dto';

@Public()
@ApiTags('public-jobs')
@Controller('public/jobs')
export class JobsPublicController {
  constructor(private jobsService: JobsService) {}

  @Get()
  findAll(@Query() query: JobsQueryDto) {
    return this.jobsService.findAll(query, true);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findPublicOrFail(id);
  }
}
