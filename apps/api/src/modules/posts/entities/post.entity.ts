import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PostType } from '../../../common/enums';
import { Media } from '../../media/entities/media.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: PostType })
  type: PostType;

  @Column({ type: 'varchar', nullable: true })
  coverImageId: string | null;

  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn({ name: 'coverImageId' })
  coverImage: Media | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date | null;
}
