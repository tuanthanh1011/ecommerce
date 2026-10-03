import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InternalAnnouncementsService } from './internal-announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiBearerAuth()
@ApiTags('internal-announcements')
@Controller('admin/internal-announcements')
export class InternalAnnouncementsController {
  constructor(
    private internalAnnouncementsService: InternalAnnouncementsService,
  ) {}

  @Get()
  findAll() {
    return this.internalAnnouncementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internalAnnouncementsService.findOneOrFail(id);
  }

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.internalAnnouncementsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.internalAnnouncementsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.internalAnnouncementsService.remove(id);
    return { success: true };
  }
}
