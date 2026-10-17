import { Module } from '@nestjs/common';
import { BackupsController } from './backups.controller';
import { BackupsService } from './backups.service';
import { BackupStorageService } from './backup-storage.service';

@Module({
  controllers: [BackupsController],
  providers: [BackupsService, BackupStorageService],
})
export class BackupsModule {}
