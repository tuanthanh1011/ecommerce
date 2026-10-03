import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MediaType } from '../../../common/enums';

@Entity('media')
export class Media extends BaseEntity {
  @Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
  type: MediaType;

  @Column({ unique: true })
  key: string;

  @Column()
  url: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  sizeBytes: number | null;

  @Column({ type: 'varchar', nullable: true })
  originalFileName: string | null;
}
