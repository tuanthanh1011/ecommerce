import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DocumentCategory } from '../../../common/enums';
import { Media } from '../../media/entities/media.entity';

@Entity('documents')
export class Document extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', nullable: true })
  fileId: string | null;

  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn({ name: 'fileId' })
  file: Media | null;
}
