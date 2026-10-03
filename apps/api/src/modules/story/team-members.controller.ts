import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ReorderTeamMembersDto } from './dto/reorder-team-members.dto';
import { TeamMemberGroup } from '../../common/enums';

@ApiBearerAuth()
@ApiTags('team-members')
@Controller('admin/story/team-members')
export class TeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  findAll(@Query('group') group?: TeamMemberGroup) {
    return this.teamMembersService.findAll(group);
  }

  @Post()
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamMembersService.create(dto);
  }

  @Patch('reorder')
  async reorder(@Body() dto: ReorderTeamMembersDto) {
    await this.teamMembersService.reorder(dto);
    return { success: true };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamMembersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teamMembersService.remove(id);
    return { success: true };
  }
}
