import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { spawn } from 'node:child_process';
import { createGzip } from 'node:zlib';
import { describeError } from '../../common/utils/describe-error';
import { BackupStorageService } from './backup-storage.service';

export interface BackupRunResult {
  prefix: string;
  mediaObjectCount: number;
  durationMs: number;
}

export interface BackupSummary {
  dateKey: string;
  objectCount: number;
  totalBytes: number;
  lastModified?: Date;
}

const BACKUP_CRON_JOB_NAME = 'nightly-backup';
const BACKUP_PREFIX = 'backups/';
// Limits how many media objects are copied Garage -> R2 at once, so a large
// library doesn't open hundreds of simultaneous streams.
const MEDIA_COPY_CONCURRENCY = 4;

@Injectable()
export class BackupsService implements OnModuleInit {
  private readonly logger = new Logger(BackupsService.name);
  private running = false;

  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private storage: BackupStorageService,
  ) {}

  onModuleInit(): void {
    const cronExpression =
      this.configService.get<string>('BACKUP_CRON') ?? '0 3 * * *';
    const job = new CronJob(cronExpression, () => {
      this.runBackup().catch((err: unknown) => {
        const { message, stack } = describeError(err);
        this.logger.error(`Scheduled backup failed: ${message}`, stack);
      });
    });
    this.schedulerRegistry.addCronJob(BACKUP_CRON_JOB_NAME, job);
    job.start();
    this.logger.log(`Nightly backup scheduled with cron "${cronExpression}"`);
  }

  async runBackup(): Promise<BackupRunResult> {
    if (this.running) {
      throw new ConflictException('A backup is already in progress');
    }
    this.running = true;
    const startedAt = Date.now();
    const dateKey = new Date().toISOString().replace(/[:.]/g, '-');
    const prefix = `${BACKUP_PREFIX}${dateKey}/`;

    try {
      this.logger.log(`Starting backup -> ${prefix}`);
      await this.backupDatabase(prefix);
      const mediaObjectCount = await this.backupMedia(prefix);
      await this.pruneOldBackups();

      const durationMs = Date.now() - startedAt;
      this.logger.log(
        `Backup complete: ${prefix} (${mediaObjectCount} media objects, ${durationMs}ms)`,
      );
      return { prefix, mediaObjectCount, durationMs };
    } finally {
      this.running = false;
    }
  }

  async listBackups(): Promise<BackupSummary[]> {
    const objects = await this.storage.listR2Objects(BACKUP_PREFIX);
    const byDateKey = new Map<string, BackupSummary>();
    for (const obj of objects) {
      const rest = obj.key.slice(BACKUP_PREFIX.length);
      const dateKey = rest.split('/')[0];
      if (!dateKey) continue;
      const existing = byDateKey.get(dateKey);
      if (existing) {
        existing.objectCount += 1;
        existing.totalBytes += obj.size;
        if (
          !existing.lastModified ||
          (obj.lastModified && obj.lastModified > existing.lastModified)
        ) {
          existing.lastModified = obj.lastModified;
        }
      } else {
        byDateKey.set(dateKey, {
          dateKey,
          objectCount: 1,
          totalBytes: obj.size,
          lastModified: obj.lastModified,
        });
      }
    }
    return [...byDateKey.values()].sort((a, b) =>
      b.dateKey.localeCompare(a.dateKey),
    );
  }

  private async backupDatabase(prefix: string): Promise<void> {
    const databaseUrl = this.configService.get<string>('DATABASE_URL')!;
    const dump = spawn('pg_dump', [
      '--no-owner',
      '--no-privileges',
      '--format=plain',
      databaseUrl,
    ]);

    let stderr = '';
    dump.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    const gzip = createGzip();
    // dump.stdout and gzip are EventEmitters too — an unhandled 'error' on
    // either would crash the whole Node process (not just fail this one
    // backup run). The real failure still surfaces correctly: uploadToR2
    // (lib-storage's Upload) attaches its own 'error' listener to this same
    // `gzip` stream and rejects its promise when it errors, and a failed
    // pg_dump process is already caught via dump's own 'error'/'close'
    // handling below.
    dump.stdout.on('error', () => {});
    gzip.on('error', () => {});
    dump.stdout.pipe(gzip);

    const [, exitCode] = await Promise.all([
      this.storage.uploadToR2(`${prefix}db.sql.gz`, gzip, 'application/gzip'),
      new Promise<number>((resolve, reject) => {
        dump.on('error', reject);
        dump.on('close', (code) => resolve(code ?? 1));
      }),
    ]);

    if (exitCode !== 0) {
      throw new Error(
        `pg_dump exited with code ${exitCode}: ${stderr.slice(0, 2000)}`,
      );
    }
  }

  private async backupMedia(prefix: string): Promise<number> {
    const objects = await this.storage.listGarageObjects();
    let completed = 0;
    let cursor = 0;

    const worker = async () => {
      for (;;) {
        const index = cursor;
        cursor += 1;
        if (index >= objects.length) return;
        const obj = objects[index];
        const stream = await this.storage.getGarageObjectStream(obj.key);
        await this.storage.uploadToR2(
          `${prefix}media/${obj.key}`,
          stream,
          'application/octet-stream',
        );
        completed += 1;
      }
    };

    const workers = Array.from(
      { length: Math.min(MEDIA_COPY_CONCURRENCY, Math.max(objects.length, 1)) },
      () => worker(),
    );
    await Promise.all(workers);
    return completed;
  }

  private async pruneOldBackups(): Promise<void> {
    const retention =
      this.configService.get<number>('BACKUP_RETENTION_COUNT') ?? 3;
    const objects = await this.storage.listR2Objects(BACKUP_PREFIX);

    const dateKeys = [
      ...new Set(
        objects
          .map((o) => o.key.slice(BACKUP_PREFIX.length).split('/')[0])
          .filter(Boolean),
      ),
    ].sort((a, b) => b.localeCompare(a));

    const toDelete = new Set(dateKeys.slice(retention));
    if (toDelete.size === 0) return;

    const keysToDelete = objects
      .filter((o) =>
        toDelete.has(o.key.slice(BACKUP_PREFIX.length).split('/')[0]),
      )
      .map((o) => o.key);

    this.logger.log(
      `Pruning ${toDelete.size} old backup(s) (${keysToDelete.length} objects): ${[...toDelete].join(', ')}`,
    );
    await this.storage.deleteR2Objects(keysToDelete);
  }
}
