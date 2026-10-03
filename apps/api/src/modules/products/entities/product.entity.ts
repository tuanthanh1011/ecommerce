import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import {
  DrinkSubType,
  MerchandiseSubType,
  ProductCategory,
  ProductStatus,
} from '../../../common/enums';
import { ProductPhoto } from './product-photo.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'enum', enum: DrinkSubType, nullable: true })
  drinkSubType: DrinkSubType | null;

  @Column({ type: 'enum', enum: MerchandiseSubType, nullable: true })
  merchandiseSubType: MerchandiseSubType | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: string | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => ProductPhoto, (p) => p.product, { cascade: true })
  photos: ProductPhoto[];
}
