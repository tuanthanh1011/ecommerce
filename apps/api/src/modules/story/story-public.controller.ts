import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { StoryBlocksService } from './story-blocks.service';
import { TeamMembersService } from './team-members.service';
import { TeamMemberGroup } from '../../common/enums';

@Public()
@ApiTags('public-story')
@Controller('public/story')
export class StoryPublicController {
  constructor(
    private storyBlocksService: StoryBlocksService,
    private teamMembersService: TeamMembersService,
  ) {}

  @Get('blocks')
  findBlocks() {
    return this.storyBlocksService.findAll(true);
  }

  @Get('team-members')
  findTeamMembers(@Query('group') group?: TeamMemberGroup) {
    return this.teamMembersService.findAll(group);
  }
}
