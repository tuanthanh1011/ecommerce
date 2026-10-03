import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { PresignDto } from './dto/presign.dto';
import { CreateMediaDto } from './dto/create-media.dto';

@ApiBearerAuth()
@ApiTags('media')
@Controller('admin/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('presign')
  presign(@Body() dto: PresignDto) {
    return this.mediaService.presign(dto);
  }

  @Post()
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('mimeType') mimeType?: string,
  ) {
    return this.mediaService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      mimeType,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.mediaService.remove(id);
    return { success: true };
  }
}
