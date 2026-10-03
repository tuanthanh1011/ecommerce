import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StoryBlocksService } from './story-blocks.service';
import { UpsertStoryBlockDto } from './dto/upsert-story-block.dto';

@ApiBearerAuth()
@ApiTags('story-blocks')
@Controller('admin/story/blocks')
export class StoryBlocksController {
  constructor(private storyBlocksService: StoryBlocksService) {}

  @Get()
  findAll() {
    return this.storyBlocksService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.storyBlocksService.findOne(slug);
  }

  @Put(':slug')
  upsert(@Param('slug') slug: string, @Body() dto: UpsertStoryBlockDto) {
    return this.storyBlocksService.upsert(slug, dto);
  }
}
