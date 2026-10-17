import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { SiteSettingsService } from './site-settings.service';

@Public()
@ApiTags('public-site-settings')
@Controller('public/site-settings')
export class SiteSettingsPublicController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get('contact')
  getContact() {
    return this.siteSettingsService.getContact();
  }

  @Get('home')
  getHome() {
    return this.siteSettingsService.getHome();
  }
}
