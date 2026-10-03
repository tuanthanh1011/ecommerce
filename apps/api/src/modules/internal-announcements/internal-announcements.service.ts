import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalAnnouncement } from './entities/internal-announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class InternalAnnouncementsService {
  constructor(
    @InjectRepository(InternalAnnouncement)
    private announcementsRepo: Repository<InternalAnnouncement>,
  ) {}

  findAll() {
    return this.announcementsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOneOrFail(id: string): Promise<InternalAnnouncement> {
    const item = await this.announcementsRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Announcement not found');
    return item;
  }

  create(dto: CreateAnnouncementDto) {
    const item = this.announcementsRepo.create({
      ...dto,
      pinnedUntil: dto.pinnedUntil ? new Date(dto.pinnedUntil) : null,
    });
    return this.announcementsRepo.save(item);
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    const item = await this.findOneOrFail(id);
    Object.assign(item, {
      ...dto,
      pinnedUntil: dto.pinnedUntil
        ? new Date(dto.pinnedUntil)
        : item.pinnedUntil,
    });
    return this.announcementsRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.announcementsRepo.remove(item);
  }
}
