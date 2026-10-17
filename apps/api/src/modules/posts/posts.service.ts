import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, In, Not, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { slugify } from '../../common/utils/slugify';
import { AdminRole, PostType } from '../../common/enums';

/**
 * Employees are read-only (enforced globally by RolesGuard) and scoped to
 * "Nội bộ" content, which for Posts means the INTERNAL_UPDATE type. The two
 * read methods an Employee can reach take the acting role and enforce that
 * scope here, since the route guard can't express "this role, but only these
 * rows". All writes are Admin-only, so they take no role.
 */
@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  async findAll(
    query: PostsQueryDto,
    publicOnly = false,
    actingRole?: AdminRole,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    // The public site must never surface INTERNAL_UPDATE posts, regardless
    // of isPublished — that flag only means "visible to staff" for internal
    // content, it is not a public-visibility switch for that type. So the
    // exclusion below is unconditional, not just a default when no `type`
    // filter was requested.
    let typeCondition: PostType | FindOperator<PostType> | undefined;
    if (actingRole === AdminRole.EMPLOYEE) {
      typeCondition = PostType.INTERNAL_UPDATE;
    } else if (publicOnly) {
      typeCondition =
        query.type && query.type !== PostType.INTERNAL_UPDATE
          ? query.type
          : Not(
              In(
                query.excludeType
                  ? [PostType.INTERNAL_UPDATE, query.excludeType]
                  : [PostType.INTERNAL_UPDATE],
              ),
            );
    } else {
      typeCondition = query.type;
    }

    const [data, total] = await this.postsRepo.findAndCount({
      where: {
        ...(query.search ? { title: ILike(`%${query.search}%`) } : {}),
        ...(typeCondition ? { type: typeCondition } : {}),
        ...(query.isPublished !== undefined
          ? { isPublished: query.isPublished }
          : {}),
        ...(publicOnly ? { isPublished: true } : {}),
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneOrFail(id: string, actingRole?: AdminRole): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    this.assertScope(post, actingRole);
    return post;
  }

  /**
   * Public lookup only — must never return a draft (isPublished: false) or
   * an INTERNAL_UPDATE post (employee-only content), even if the slug is
   * known or guessed. Admin/Employee lookups go through findOneOrFail.
   */
  async findBySlugOrFail(slug: string): Promise<Post> {
    const post = await this.postsRepo.findOne({
      where: { slug, isPublished: true, type: Not(PostType.INTERNAL_UPDATE) },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const slug = await this.generateUniqueSlug(dto.slug || dto.title);
    const post = this.postsRepo.create({ ...dto, slug });
    return this.postsRepo.save(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOneOrFail(id);
    if (dto.slug && dto.slug !== post.slug) {
      dto.slug = await this.generateUniqueSlug(dto.slug, id);
    }
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOneOrFail(id);
    await this.postsRepo.remove(post);
  }

  async setPublished(id: string, isPublished: boolean): Promise<Post> {
    const post = await this.findOneOrFail(id);
    post.isPublished = isPublished;
    post.publishedAt = isPublished ? new Date() : null;
    return this.postsRepo.save(post);
  }

  /** Employees may only ever read INTERNAL_UPDATE posts; Admin is unrestricted. */
  private assertScope(post: Post, actingRole?: AdminRole): void {
    if (
      actingRole === AdminRole.EMPLOYEE &&
      post.type !== PostType.INTERNAL_UPDATE
    ) {
      throw new ForbiddenException(
        'Tài khoản của bạn chỉ được xem tin tức nội bộ',
      );
    }
  }

  private async generateUniqueSlug(
    source: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(source);
    let candidate = base;
    let suffix = 1;
    while (
      await this.postsRepo
        .findOne({
          where: { slug: candidate },
        })
        .then((p) => p && p.id !== excludeId)
    ) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
    return candidate;
  }
}
