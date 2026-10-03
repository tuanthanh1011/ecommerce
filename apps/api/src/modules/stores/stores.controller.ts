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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AttachPhotoDto } from './dto/attach-photo.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiBearerAuth()
@ApiTags('stores')
@Controller('admin/stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.storesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOneOrFail(id);
  }

  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storesService.remove(id);
    return { success: true };
  }

  @Post(':id/photos')
  attachPhoto(@Param('id') id: string, @Body() dto: AttachPhotoDto) {
    return this.storesService.attachPhoto(id, dto.mediaId);
  }

  @Delete(':id/photos/:photoId')
  async detachPhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    await this.storesService.detachPhoto(id, photoId);
    return { success: true };
  }

  @Patch(':id/photos/reorder')
  async reorderPhotos(@Param('id') id: string, @Body() dto: ReorderPhotosDto) {
    await this.storesService.reorderPhotos(id, dto);
    return { success: true };
  }
}
