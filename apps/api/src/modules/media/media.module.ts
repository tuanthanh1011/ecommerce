import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaController, PublicMediaController } from './media.controller';
import { MediaService } from './media.service';
import { StorageService } from './storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController, PublicMediaController],
  providers: [MediaService, StorageService],
  exports: [MediaService],
})
export class MediaModule {}
