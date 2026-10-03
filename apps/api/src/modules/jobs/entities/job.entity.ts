import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { JobStatus } from '../../../common/enums';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column()
  title: string;

  @Column()
  department: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.OPEN })
  status: JobStatus;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  postedAt: Date;
}
