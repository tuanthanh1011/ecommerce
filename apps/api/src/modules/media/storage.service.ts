import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';

/**
 * S3-compatible client for the self-hosted Garage (R2 is backup-only, see the
 * backups module). Garage is only reachable over the Docker network
 * (`garage:3900`): uploads go browser -> API -> Garage and public reads go
 * Garage -> API -> browser (see MediaController), so Garage needs no public
 * port, CORS policy or domain.
 */
@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('GARAGE_BUCKET_NAME')!;
    this.publicBaseUrl = this.configService
      .get<string>('GARAGE_PUBLIC_BASE_URL')!
      .replace(/\/$/, '');

    this.client = new S3Client({
      region: this.configService.get<string>('GARAGE_REGION') ?? 'garage',
      endpoint: this.configService.get<string>('GARAGE_INTERNAL_ENDPOINT'),
      // Garage is S3-compatible but only supports path-style addressing here.
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('GARAGE_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'GARAGE_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async putObject(key: string, body: Buffer, mimeType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
        ContentLength: body.length,
      }),
    );
  }

  /** Returns null when the object does not exist. */
  async getObject(
    key: string,
  ): Promise<{ body: Readable; contentType?: string; size?: number } | null> {
    try {
      const res = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return {
        body: res.Body as Readable,
        contentType: res.ContentType,
        size: res.ContentLength,
      };
    } catch (err) {
      if ((err as { name?: string }).name === 'NoSuchKey') return null;
      throw err;
    }
  }

  /** `GARAGE_PUBLIC_BASE_URL` is the API's own public media route. */
  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
