import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ScheduleEntry } from './entities/schedule-entry.entity';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto';

@Injectable()
export class ScheduleEntriesService {
  constructor(
    @InjectRepository(ScheduleEntry)
    private scheduleRepo: Repository<ScheduleEntry>,
  ) {}

  findAll(from?: string, to?: string) {
    return this.scheduleRepo.find({
      where:
        from && to ? { startAt: Between(new Date(from), new Date(to)) } : {},
      order: { startAt: 'ASC' },
    });
  }

  async findOneOrFail(id: string): Promise<ScheduleEntry> {
    const entry = await this.scheduleRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException('Schedule entry not found');
    return entry;
  }

  create(dto: CreateScheduleEntryDto) {
    const entry = this.scheduleRepo.create({
      ...dto,
      startAt: new Date(dto.startAt),
      endAt: dto.endAt ? new Date(dto.endAt) : null,
    });
    return this.scheduleRepo.save(entry);
  }

  async update(id: string, dto: UpdateScheduleEntryDto) {
    const entry = await this.findOneOrFail(id);
    Object.assign(entry, {
      ...dto,
      startAt: dto.startAt ? new Date(dto.startAt) : entry.startAt,
      endAt: dto.endAt ? new Date(dto.endAt) : entry.endAt,
    });
    return this.scheduleRepo.save(entry);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.findOneOrFail(id);
    await this.scheduleRepo.remove(entry);
  }
}
