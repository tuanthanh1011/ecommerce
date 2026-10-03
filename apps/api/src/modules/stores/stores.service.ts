import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { StorePhoto } from './entities/store-photo.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storesRepo: Repository<Store>,
    @InjectRepository(StorePhoto)
    private storePhotosRepo: Repository<StorePhoto>,
  ) {}

  async findAll(query: PaginationQueryDto, onlyActive = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await this.storesRepo.findAndCount({
      where: {
        ...(query.search ? { name: ILike(`%${query.search}%`) } : {}),
        ...(onlyActive ? { isActive: true } : {}),
      },
      relations: { photos: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneOrFail(id: string): Promise<Store> {
    const store = await this.storesRepo.findOne({
      where: { id },
      relations: { photos: true },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async create(dto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepo.create(dto);
    return this.storesRepo.save(store);
  }

  async update(id: string, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOneOrFail(id);
    Object.assign(store, dto);
    return this.storesRepo.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOneOrFail(id);
    await this.storesRepo.remove(store);
  }

  async attachPhoto(storeId: string, mediaId: string): Promise<StorePhoto> {
    await this.findOneOrFail(storeId);
    const count = await this.storePhotosRepo.count({ where: { storeId } });
    const photo = this.storePhotosRepo.create({
      storeId,
      mediaId,
      sortOrder: count,
    });
    return this.storePhotosRepo.save(photo);
  }

  async detachPhoto(storeId: string, photoId: string): Promise<void> {
    const photo = await this.storePhotosRepo.findOne({
      where: { id: photoId, storeId },
    });
    if (!photo) throw new NotFoundException('Photo not found');
    await this.storePhotosRepo.remove(photo);
  }

  async reorderPhotos(storeId: string, dto: ReorderPhotosDto): Promise<void> {
    await Promise.all(
      dto.items.map((item) =>
        this.storePhotosRepo.update(
          { id: item.id, storeId },
          { sortOrder: item.sortOrder },
        ),
      ),
    );
  }
}
