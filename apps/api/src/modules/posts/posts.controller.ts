import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminRole } from '../../common/enums';
import {
  CurrentAdmin,
  type CurrentAdminPayload,
} from '../../common/decorators/current-admin.decorator';

// Both roles can reach this controller, but Employees are read-only (RolesGuard
// refuses their writes) and PostsService limits what they can read to
// INTERNAL_UPDATE posts (see assertScope there).
@ApiBearerAuth()
@ApiTags('posts')
@Roles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
@Controller('admin/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll(
    @Query() query: PostsQueryDto,
    @CurrentAdmin() current: CurrentAdminPayload,
  ) {
    return this.postsService.findAll(query, false, current.role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentAdmin() current: CurrentAdminPayload,
  ) {
    return this.postsService.findOneOrFail(id, current.role);
  }

  @HttpPost()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Patch(':id/publish')
  setPublished(@Param('id') id: string, @Body() dto: PublishPostDto) {
    return this.postsService.setPublished(id, dto.isPublished);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.postsService.remove(id);
    return { success: true };
  }
}
