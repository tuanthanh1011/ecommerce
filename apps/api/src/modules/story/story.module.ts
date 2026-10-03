import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryBlock } from './entities/story-block.entity';
import { TeamMember } from './entities/team-member.entity';
import { StoryBlocksController } from './story-blocks.controller';
import { StoryBlocksService } from './story-blocks.service';
import { TeamMembersController } from './team-members.controller';
import { TeamMembersService } from './team-members.service';
import { StoryPublicController } from './story-public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoryBlock, TeamMember])],
  controllers: [
    StoryBlocksController,
    TeamMembersController,
    StoryPublicController,
  ],
  providers: [StoryBlocksService, TeamMembersService],
})
export class StoryModule {}
