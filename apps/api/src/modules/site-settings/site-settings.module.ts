import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsPublicController } from './site-settings-public.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting])],
  controllers: [SiteSettingsController, SiteSettingsPublicController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
