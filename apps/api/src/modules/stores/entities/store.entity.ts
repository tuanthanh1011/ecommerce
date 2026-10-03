import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { StorePhoto } from './store-photo.entity';

@Entity('stores')
export class Store extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  googleMapsUrl: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => StorePhoto, (p) => p.store, { cascade: true })
  photos: StorePhoto[];
}
