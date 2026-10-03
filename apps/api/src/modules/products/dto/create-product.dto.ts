import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import {
  DrinkSubType,
  MerchandiseSubType,
  ProductCategory,
  ProductStatus,
} from '../../../common/enums';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiPropertyOptional({ enum: DrinkSubType })
  @IsOptional()
  @IsEnum(DrinkSubType)
  drinkSubType?: DrinkSubType;

  @ApiPropertyOptional({ enum: MerchandiseSubType })
  @IsOptional()
  @IsEnum(MerchandiseSubType)
  merchandiseSubType?: MerchandiseSubType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  price?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
