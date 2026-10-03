import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RefreshToken, (rt) => rt.admin)
  refreshTokens: RefreshToken[];
}
