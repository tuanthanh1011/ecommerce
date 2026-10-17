import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { Readable } from 'node:stream';

export interface ObjectSummary {
  key: string;
  size: number;
  lastModified?: Date;
}

/**
 * Two S3-compatible clients used only by the backup job: one that *reads*
 * from the live Garage bucket (media files being backed up) and one that
 * *writes* to the Cloudflare R2 backup bucket. Kept separate from
 * modules/media/storage.service.ts on purpose — that one is about serving
 * live traffic (presigned uploads), this one is purely an offline job.
 */
@Injectable()
export class BackupStorageService {
  private readonly garageClient: S3Client;
  private readonly garageBucket: string;
  private readonly r2Client: S3Client;
  private readonly r2Bucket: string;

  constructor(private configService: ConfigService) {
    this.garageBucket = this.configService.get<string>('GARAGE_BUCKET_NAME')!;
    this.garageClient = new S3Client({
      region: this.configService.get<string>('GARAGE_REGION') ?? 'garage',
      endpoint: this.configService.get<string>('GARAGE_INTERNAL_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('GARAGE_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'GARAGE_SECRET_ACCESS_KEY',
        )!,
      },
    });

    this.r2Bucket = this.configService.get<string>('R2_BACKUP_BUCKET_NAME')!;
    const r2AccountId = this.configService.get<string>('R2_ACCOUNT_ID');
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint:
        this.configService.get<string>('R2_ENDPOINT') ||
        `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'R2_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  /** Every object currently in the live Garage media bucket. */
  async listGarageObjects(): Promise<ObjectSummary[]> {
    return this.listAll(this.garageClient, this.garageBucket);
  }

  async getGarageObjectStream(key: string): Promise<Readable> {
    const res = await this.garageClient.send(
      new GetObjectCommand({ Bucket: this.garageBucket, Key: key }),
    );
    return res.Body as Readable;
  }

  /** Streams `body` to the R2 backup bucket without buffering it whole in memory. */
  async uploadToR2(
    key: string,
    body: Readable,
    contentType: string,
  ): Promise<void> {
    const upload = new Upload({
      client: this.r2Client,
      params: {
        Bucket: this.r2Bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      // Keep memory bounded for large media libraries.
      queueSize: 4,
      partSize: 8 * 1024 * 1024,
    });
    await upload.done();
  }

  async listR2Objects(prefix: string): Promise<ObjectSummary[]> {
    return this.listAll(this.r2Client, this.r2Bucket, prefix);
  }

  async deleteR2Objects(keys: string[]): Promise<void> {
    for (let i = 0; i < keys.length; i += 1000) {
      const chunk = keys.slice(i, i + 1000);
      await this.r2Client.send(
        new DeleteObjectsCommand({
          Bucket: this.r2Bucket,
          Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
        }),
      );
    }
  }

  private async listAll(
    client: S3Client,
    bucket: string,
    prefix?: string,
  ): Promise<ObjectSummary[]> {
    const objects: ObjectSummary[] = [];
    let continuationToken: string | undefined;
    do {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of res.Contents ?? []) {
        if (!obj.Key) continue;
        objects.push({
          key: obj.Key,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified,
        });
      }
      continuationToken = res.IsTruncated
        ? res.NextContinuationToken
        : undefined;
    } while (continuationToken);
    return objects;
  }
}
