import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalAnnouncement } from './entities/internal-announcement.entity';
import { ScheduleEntry } from './entities/schedule-entry.entity';
import { InternalAnnouncementsController } from './internal-announcements.controller';
import { InternalAnnouncementsService } from './internal-announcements.service';
import { ScheduleEntriesController } from './schedule-entries.controller';
import { ScheduleEntriesService } from './schedule-entries.service';

@Module({
  imports: [TypeOrmModule.forFeature([InternalAnnouncement, ScheduleEntry])],
  controllers: [InternalAnnouncementsController, ScheduleEntriesController],
  providers: [InternalAnnouncementsService, ScheduleEntriesService],
})
export class InternalAnnouncementsModule {}
