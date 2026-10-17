import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BackupsService } from './backups.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminRole } from '../../common/enums';

// Backups touch the DB and every uploaded file — Admin-only, Employees have
// no reason to trigger or inspect these.
@ApiBearerAuth()
@ApiTags('backups')
@Roles(AdminRole.ADMIN)
@Controller('admin/backups')
export class BackupsController {
  constructor(private backupsService: BackupsService) {}

  @Get()
  list() {
    return this.backupsService.listBackups();
  }

  @Post('run')
  run() {
    return this.backupsService.runBackup();
  }
}
