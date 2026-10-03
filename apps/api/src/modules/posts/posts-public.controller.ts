import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PostsService } from './posts.service';
import { PostsQueryDto } from './dto/posts-query.dto';

@Public()
@ApiTags('public-posts')
@Controller('public/posts')
export class PostsPublicController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll(@Query() query: PostsQueryDto) {
    return this.postsService.findAll(query, true);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findBySlugOrFail(slug);
  }
}
