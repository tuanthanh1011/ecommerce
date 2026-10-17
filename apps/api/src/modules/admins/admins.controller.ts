import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminRole } from '../../common/enums';

// Account management is Admin-only — Employee accounts are managed by Admins,
// never self-service, and Employees have no business seeing the admin list.
@ApiBearerAuth()
@ApiTags('admins')
@Roles(AdminRole.ADMIN)
@Controller('admin/admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminsService.update(id, dto);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    await this.adminsService.updatePassword(id, dto.password);
    return { success: true };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adminsService.remove(id);
    return { success: true };
  }
}
