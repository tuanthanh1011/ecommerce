import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';
import { Product } from './product.entity';

@Entity('product_photos')
export class ProductPhoto extends BaseEntity {
  @Column()
  productId: string;

  @ManyToOne(() => Product, (p) => p.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  mediaId: string;

  @ManyToOne(() => Media, { eager: true })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
