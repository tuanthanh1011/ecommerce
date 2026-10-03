import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';
import { Store } from './store.entity';

@Entity('store_photos')
export class StorePhoto extends BaseEntity {
  @Column()
  storeId: string;

  @ManyToOne(() => Store, (s) => s.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  mediaId: string;

  @ManyToOne(() => Media, { eager: true })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
