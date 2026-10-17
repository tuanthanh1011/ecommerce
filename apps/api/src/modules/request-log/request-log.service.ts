import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { LessThan, Repository } from 'typeorm';
import { describeError } from '../../common/utils/describe-error';
import { RequestLog } from './entities/request-log.entity';

export interface RecordRequestLogInput {
  method: string;
  path: string;
  query: string | null;
  statusCode: number;
  durationMs: number;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  adminId: string | null;
  adminRole: string | null;
  requestBodyBytes: number | null;
}

const CLEANUP_CRON_JOB_NAME = 'request-log-cleanup';

@Injectable()
export class RequestLogService implements OnModuleInit {
  private readonly logger = new Logger(RequestLogService.name);

  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepo: Repository<RequestLog>,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    // Once a day at 04:00 — after the nightly backup (03:00) so a busy
    // backup run doesn't compete with this for DB I/O.
    const job = new CronJob('0 4 * * *', () => {
      this.pruneOldLogs().catch((err: unknown) => {
        const { message, stack } = describeError(err);
        this.logger.error(`Request log cleanup failed: ${message}`, stack);
      });
    });
    this.schedulerRegistry.addCronJob(CLEANUP_CRON_JOB_NAME, job);
    job.start();
  }

  /** Fire-and-forget from the interceptor — never let logging fail a request. */
  async record(input: RecordRequestLogInput): Promise<void> {
    const entry = this.requestLogRepo.create({
      ...input,
      isError: input.statusCode >= 400,
    });
    await this.requestLogRepo.save(entry);
  }

  async pruneOldLogs(): Promise<number> {
    const retentionDays =
      this.configService.get<number>('REQUEST_LOG_RETENTION_DAYS') ?? 30;
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const result = await this.requestLogRepo.delete({
      createdAt: LessThan(cutoff),
    });
    const deleted = result.affected ?? 0;
    if (deleted > 0) {
      this.logger.log(
        `Pruned ${deleted} request log row(s) older than ${retentionDays}d`,
      );
    }
    return deleted;
  }
}
