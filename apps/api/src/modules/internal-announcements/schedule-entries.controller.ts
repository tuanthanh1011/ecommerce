import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScheduleEntriesService } from './schedule-entries.service';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto';

@ApiBearerAuth()
@ApiTags('schedule-entries')
@Controller('admin/schedule-entries')
export class ScheduleEntriesController {
  constructor(private scheduleEntriesService: ScheduleEntriesService) {}

  @Get()
  findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return this.scheduleEntriesService.findAll(from, to);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleEntriesService.findOneOrFail(id);
  }

  @Post()
  create(@Body() dto: CreateScheduleEntryDto) {
    return this.scheduleEntriesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleEntryDto) {
    return this.scheduleEntriesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.scheduleEntriesService.remove(id);
    return { success: true };
  }
}
