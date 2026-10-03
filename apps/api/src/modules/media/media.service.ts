import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Media } from './entities/media.entity';
import { MediaType } from '../../common/enums';
import { R2Service } from './r2.service';
import { PresignDto } from './dto/presign.dto';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    private r2Service: R2Service,
  ) {}

  async presign(dto: PresignDto) {
    const safeName = dto.fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, '-');
    const key = `${randomUUID()}-${safeName}`;
    const uploadUrl = await this.r2Service.getPresignedUploadUrl(
      key,
      dto.mimeType,
    );
    return {
      uploadUrl,
      key,
      publicUrl: this.r2Service.getPublicUrl(key),
    };
  }

  async create(dto: CreateMediaDto): Promise<Media> {
    const media = this.mediaRepo.create({
      key: dto.key,
      url: this.r2Service.getPublicUrl(dto.key),
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes ?? null,
      originalFileName: dto.originalFileName ?? null,
      type: dto.type ?? MediaType.IMAGE,
    });
    return this.mediaRepo.save(media);
  }

  async findAll(page = 1, limit = 20, mimeType?: string) {
    const [data, total] = await this.mediaRepo.findAndCount({
      where: mimeType ? { mimeType } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async remove(id: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    await this.r2Service.deleteObject(media.key);
    await this.mediaRepo.remove(media);
  }
}
