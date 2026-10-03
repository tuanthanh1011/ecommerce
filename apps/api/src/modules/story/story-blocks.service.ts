import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryBlock } from './entities/story-block.entity';
import { UpsertStoryBlockDto } from './dto/upsert-story-block.dto';

@Injectable()
export class StoryBlocksService {
  constructor(
    @InjectRepository(StoryBlock)
    private storyBlocksRepo: Repository<StoryBlock>,
  ) {}

  findAll(onlyPublished = false) {
    return this.storyBlocksRepo.find({
      where: onlyPublished ? { isPublished: true } : {},
      order: { sortOrder: 'ASC' },
    });
  }

  findOne(slug: string) {
    return this.storyBlocksRepo.findOne({ where: { slug } });
  }

  async upsert(slug: string, dto: UpsertStoryBlockDto): Promise<StoryBlock> {
    let block = await this.storyBlocksRepo.findOne({ where: { slug } });
    if (!block) {
      block = this.storyBlocksRepo.create({ slug, ...dto });
    } else {
      Object.assign(block, dto);
    }
    return this.storyBlocksRepo.save(block);
  }
}
