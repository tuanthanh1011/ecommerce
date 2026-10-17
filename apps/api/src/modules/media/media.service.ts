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

/** The parts of a multer memory-storage file we use. */
export interface UploadedFileData {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    private storageService: StorageService,
    private configService: ConfigService,
  ) {}

  async upload(file: UploadedFileData | undefined): Promise<Media> {
    if (!file) throw new BadRequestException('Thiếu file tải lên');
    const maxUploadSizeBytes = this.configService.get<number>(
      'MAX_UPLOAD_SIZE_BYTES',
    )!;
    if (file.size > maxUploadSizeBytes) {
      const maxMb = (maxUploadSizeBytes / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(
        `Kích thước file vượt quá giới hạn cho phép (tối đa ${maxMb}MB)`,
      );
    }
    // Multer decodes multipart filenames as latin1; restore the UTF-8 name.
    const originalFileName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const safeName = originalFileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, '-');
    const key = `${randomUUID()}-${safeName}`;
    const mimeType = file.mimetype || 'application/octet-stream';

    await this.storageService.putObject(key, file.buffer, mimeType);

    const media = this.mediaRepo.create({
      key,
      url: this.storageService.getPublicUrl(key),
      mimeType,
      sizeBytes: file.size,
      originalFileName,
      type: mimeType.startsWith('image/') ? MediaType.IMAGE : MediaType.OTHER,
    });
    return this.mediaRepo.save(media);
  }

  getObject(key: string) {
    return this.storageService.getObject(key);
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
