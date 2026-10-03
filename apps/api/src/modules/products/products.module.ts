import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductPhoto } from './entities/product-photo.entity';
import { ProductsController } from './products.controller';
import { ProductsPublicController } from './products-public.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPhoto])],
  controllers: [ProductsController, ProductsPublicController],
  providers: [ProductsService],
})
export class ProductsModule {}
