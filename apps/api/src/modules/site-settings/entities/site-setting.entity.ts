import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/** Key/value store for small, structured website settings (one row per key). */
@Entity('site_settings')
export class SiteSetting extends BaseEntity {
  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  value: Record<string, unknown>;
}
