import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * S3-compatible client for the self-hosted Garage cluster (replaces the old
 * direct-to-Cloudflare-R2 flow — R2 is now backup-only, see the backups
 * module). Two separate S3Client instances are deliberate, not an oversight:
 *
 * - `internalClient` talks to Garage over the Docker network (`garage:3900`)
 *   for everything the API server does on its own (delete on removal).
 * - `presignClient` is configured with the PUBLIC endpoint (what the admin's
 *   *browser* can actually reach — localhost in dev, a real (sub)domain in
 *   prod) because an S3 presigned URL's signature covers the Host header, so
 *   it must be signed with the host the browser will actually hit.
 *
 * Public GET of uploaded files does not go through this service at all — it
 * goes straight to Garage's website endpoint (see getPublicUrl / README).
 */
@Injectable()
export class StorageService {
  private readonly internalClient: S3Client;
  private readonly presignClient: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('GARAGE_REGION') ?? 'garage';
    const accessKeyId = this.configService.get<string>('GARAGE_ACCESS_KEY_ID')!;
    const secretAccessKey = this.configService.get<string>(
      'GARAGE_SECRET_ACCESS_KEY',
    )!;
    this.bucket = this.configService.get<string>('GARAGE_BUCKET_NAME')!;
    this.publicBaseUrl = this.configService
      .get<string>('GARAGE_PUBLIC_BASE_URL')!
      .replace(/\/$/, '');

    const credentials = { accessKeyId, secretAccessKey };
    // Garage is S3-compatible but path-style only needs `forcePathStyle`
    // since we don't rely on its vhost-style S3 API addressing.
    this.internalClient = new S3Client({
      region,
      endpoint: this.configService.get<string>('GARAGE_INTERNAL_ENDPOINT'),
      forcePathStyle: true,
      credentials,
    });
    this.presignClient = new S3Client({
      region,
      endpoint: this.configService.get<string>('GARAGE_PUBLIC_ENDPOINT'),
      forcePathStyle: true,
      credentials,
    });
  }

  async getPresignedUploadUrl(key: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });
    return getSignedUrl(this.presignClient, command, { expiresIn: 300 });
  }

  /** Served by Garage's website endpoint, not the S3 API — see README. */
  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    await this.internalClient.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
