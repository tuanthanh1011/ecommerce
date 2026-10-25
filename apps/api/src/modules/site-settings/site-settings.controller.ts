import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { UpdateHomeSettingsDto } from './dto/update-home-settings.dto';
import {
  UpdateInternalNoticesDto,
  UpdateInternalPeopleDto,
} from './dto/update-internal-pages.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminRole } from '../../common/enums';

@ApiBearerAuth()
@ApiTags('site-settings')
@Roles(AdminRole.ADMIN)
@Controller('admin/site-settings')
export class SiteSettingsController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get('contact')
  getContact() {
    return this.siteSettingsService.getContact();
  }

  @Put('contact')
  updateContact(@Body() dto: UpdateContactSettingsDto) {
    return this.siteSettingsService.updateContact(dto);
  }

  @Get('home')
  getHome() {
    return this.siteSettingsService.getHome();
  }

  @Put('home')
  updateHome(@Body() dto: UpdateHomeSettingsDto) {
    return this.siteSettingsService.updateHome(dto);
  }

  @Get('internal-notices')
  getInternalNotices() {
    return this.siteSettingsService.getInternalNotices();
  }

  @Put('internal-notices')
  updateInternalNotices(@Body() dto: UpdateInternalNoticesDto) {
    return this.siteSettingsService.updateInternalNotices(dto);
  }

  @Get('internal-people')
  getInternalPeople() {
    return this.siteSettingsService.getInternalPeople();
  }

  @Put('internal-people')
  updateInternalPeople(@Body() dto: UpdateInternalPeopleDto) {
    return this.siteSettingsService.updateInternalPeople(dto);
  }
}
