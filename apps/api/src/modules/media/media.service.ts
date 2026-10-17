import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Media } from './entities/media.entity';
import { MediaType } from '../../common/enums';
import { StorageService } from './storage.service';
import { PresignDto } from './dto/presign.dto';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    private storageService: StorageService,
    private configService: ConfigService,
  ) {}

  async presign(dto: PresignDto) {
    const maxUploadSizeBytes = this.configService.get<number>(
      'MAX_UPLOAD_SIZE_BYTES',
    )!;
    if (dto.sizeBytes > maxUploadSizeBytes) {
      const maxMb = (maxUploadSizeBytes / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(
        `Kích thước file vượt quá giới hạn cho phép (tối đa ${maxMb}MB)`,
      );
    }
    const safeName = dto.fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, '-');
    const key = `${randomUUID()}-${safeName}`;
    const uploadUrl = await this.storageService.getPresignedUploadUrl(
      key,
      dto.mimeType,
    );
    return {
      uploadUrl,
      key,
      publicUrl: this.storageService.getPublicUrl(key),
    };
  }

  async create(dto: CreateMediaDto): Promise<Media> {
    const media = this.mediaRepo.create({
      key: dto.key,
      url: this.storageService.getPublicUrl(dto.key),
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
    await this.storageService.deleteObject(media.key);
    await this.mediaRepo.remove(media);
  }
}
