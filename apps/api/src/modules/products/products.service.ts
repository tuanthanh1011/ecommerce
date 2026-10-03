import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductPhoto } from './entities/product-photo.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { ProductStatus } from '../../common/enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(ProductPhoto)
    private productPhotosRepo: Repository<ProductPhoto>,
  ) {}

  async findAll(query: ProductsQueryDto, publicOnly = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await this.productsRepo.findAndCount({
      where: {
        ...(query.search ? { name: ILike(`%${query.search}%`) } : {}),
        ...(query.category ? { category: query.category } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(publicOnly ? { status: ProductStatus.ACTIVE } : {}),
      },
      relations: { photos: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOneOrFail(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: { photos: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepo.create(dto);
    return this.productsRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneOrFail(id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOneOrFail(id);
    await this.productsRepo.remove(product);
  }

  async attachPhoto(productId: string, mediaId: string): Promise<ProductPhoto> {
    await this.findOneOrFail(productId);
    const count = await this.productPhotosRepo.count({
      where: { productId },
    });
    const photo = this.productPhotosRepo.create({
      productId,
      mediaId,
      sortOrder: count,
    });
    return this.productPhotosRepo.save(photo);
  }

  async detachPhoto(productId: string, photoId: string): Promise<void> {
    const photo = await this.productPhotosRepo.findOne({
      where: { id: photoId, productId },
    });
    if (!photo) throw new NotFoundException('Photo not found');
    await this.productPhotosRepo.remove(photo);
  }

  async reorderPhotos(productId: string, dto: ReorderPhotosDto): Promise<void> {
    await Promise.all(
      dto.items.map((item) =>
        this.productPhotosRepo.update(
          { id: item.id, productId },
          { sortOrder: item.sortOrder },
        ),
      ),
    );
  }
}
