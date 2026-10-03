import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TeamMemberGroup } from '../../../common/enums';
import { Media } from '../../media/entities/media.entity';

@Entity('team_members')
export class TeamMember extends BaseEntity {
  @Column({ type: 'enum', enum: TeamMemberGroup })
  group: TeamMemberGroup;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  photoId: string | null;

  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn({ name: 'photoId' })
  photo: Media | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
