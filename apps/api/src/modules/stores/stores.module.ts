import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StorePhoto } from './entities/store-photo.entity';
import { StoresController } from './stores.controller';
import { StoresPublicController } from './stores-public.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StorePhoto])],
  controllers: [StoresController, StoresPublicController],
  providers: [StoresService],
})
export class StoresModule {}
