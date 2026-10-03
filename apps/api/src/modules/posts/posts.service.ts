import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';
import { slugify } from '../../common/utils/slugify';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  async findAll(query: PostsQueryDto, publicOnly = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await this.postsRepo.findAndCount({
      where: {
        ...(query.search ? { title: ILike(`%${query.search}%`) } : {}),
        ...(query.type ? { type: query.type } : {}),
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

  async findOneOrFail(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlugOrFail(slug: string): Promise<Post> {
    const post = await this.postsRepo.findOne({ where: { slug } });
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
