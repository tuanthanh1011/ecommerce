import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * One row per HTTP request handled by the API, written fire-and-forget by
 * RequestLogInterceptor so logging never adds latency to the actual
 * response. Kept deliberately free of request/response bodies (could
 * contain passwords, tokens, personal data) — only metadata useful for
 * auditing traffic and investigating abuse.
 */
@Entity('request_logs')
@Index(['createdAt'])
@Index(['path'])
@Index(['adminId'])
export class RequestLog extends BaseEntity {
  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  query: string | null;

  @Column({ type: 'int' })
  statusCode: number;

  @Column({ type: 'boolean' })
  isError: boolean;

  @Column({ type: 'int' })
  durationMs: number;

  @Column({ type: 'varchar', nullable: true })
  ip: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referer: string | null;

  @Column({ type: 'uuid', nullable: true })
  adminId: string | null;

  @Column({ type: 'varchar', nullable: true })
  adminRole: string | null;

  @Column({ type: 'int', nullable: true })
  requestBodyBytes: number | null;
}
