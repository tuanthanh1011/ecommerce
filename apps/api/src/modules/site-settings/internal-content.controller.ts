import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';

/**
 * What the website's staff-only "Nội bộ" pages read. No @Roles(): any signed-in
 * account (Admin or Employee) can read; only Admins can edit, under
 * /admin/site-settings/internal-*.
 */
@ApiBearerAuth()
@ApiTags('internal')
@Controller('internal')
export class InternalContentController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get('notices')
  notices() {
    return this.siteSettingsService.getInternalNotices();
  }

  @Get('people')
  people() {
    return this.siteSettingsService.getInternalPeople();
  }
}
