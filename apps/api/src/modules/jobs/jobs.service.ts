import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsQueryDto } from './dto/jobs-query.dto';
import { JobStatus } from '../../common/enums';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private jobsRepo: Repository<Job>) {}

  async findAll(query: JobsQueryDto, publicOnly = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await this.jobsRepo.findAndCount({
      where: {
        ...(query.search ? { title: ILike(`%${query.search}%`) } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(publicOnly ? { status: JobStatus.OPEN } : {}),
      },
      order: { postedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneOrFail(id: string): Promise<Job> {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepo.create(dto);
    return this.jobsRepo.save(job);
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOneOrFail(id);
    Object.assign(job, dto);
    return this.jobsRepo.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOneOrFail(id);
    await this.jobsRepo.remove(job);
  }

  async close(id: string): Promise<Job> {
    const job = await this.findOneOrFail(id);
    job.status = JobStatus.CLOSED;
    return this.jobsRepo.save(job);
  }
}
