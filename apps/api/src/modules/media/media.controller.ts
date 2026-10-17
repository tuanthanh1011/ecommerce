import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import type { UploadedFileData } from './media.service';
import { Public } from '../../common/decorators/public.decorator';

// Hard ceiling for the multipart parser (MediaService enforces the
// configurable MAX_UPLOAD_SIZE_BYTES with a friendly message below this).
const PARSER_MAX_BYTES = 100 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('media')
@Controller('admin/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: PARSER_MAX_BYTES },
    }),
  )
  upload(@UploadedFile() file: UploadedFileData | undefined) {
    return this.mediaService.upload(file);
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

/**
 * Public file serving (what `Media.url` points at). Keys are random UUID
 * prefixed, so URLs are unguessable and immutable — safe to cache forever.
 */
@ApiTags('media')
@Controller('public/media')
export class PublicMediaController {
  constructor(private mediaService: MediaService) {}

  @Public()
  @SkipThrottle()
  @Get(':key')
  async serve(@Param('key') key: string, @Res() res: Response) {
    const object = await this.mediaService.getObject(key);
    if (!object) throw new NotFoundException('File not found');

    res.setHeader(
      'Content-Type',
      object.contentType ?? 'application/octet-stream',
    );
    if (object.size !== undefined) res.setHeader('Content-Length', object.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    // Uploaded files come from admins but are served from the API origin:
    // never let one run script (e.g. an SVG/HTML) if opened directly.
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    );
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    object.body.pipe(res);
  }
}
