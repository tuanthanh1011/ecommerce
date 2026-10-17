import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { AdminRole } from '../../../common/enums';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: AdminRole, default: AdminRole.ADMIN })
  role: AdminRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RefreshToken, (rt) => rt.admin)
  refreshTokens: RefreshToken[];
}
