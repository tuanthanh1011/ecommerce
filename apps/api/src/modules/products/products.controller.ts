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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AttachPhotoDto } from './dto/attach-photo.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';
import { ProductsQueryDto } from './dto/products-query.dto';

@ApiBearerAuth()
@ApiTags('products')
@Controller('admin/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneOrFail(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { success: true };
  }

  @Post(':id/photos')
  attachPhoto(@Param('id') id: string, @Body() dto: AttachPhotoDto) {
    return this.productsService.attachPhoto(id, dto.mediaId);
  }

  @Delete(':id/photos/:photoId')
  async detachPhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    await this.productsService.detachPhoto(id, photoId);
    return { success: true };
  }

  @Patch(':id/photos/reorder')
  async reorderPhotos(@Param('id') id: string, @Body() dto: ReorderPhotosDto) {
    await this.productsService.reorderPhotos(id, dto);
    return { success: true };
  }
}
