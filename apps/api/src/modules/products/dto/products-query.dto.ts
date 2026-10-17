import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import {
  DrinkSubType,
  MerchandiseSubType,
  ProductCategory,
  ProductStatus,
} from '../../../common/enums';
import { parseQueryBoolean } from '../../../common/utils/query-boolean';

export class ProductsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ProductCategory })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({ enum: DrinkSubType })
  @IsOptional()
  @IsEnum(DrinkSubType)
  drinkSubType?: DrinkSubType;

  @ApiPropertyOptional({ enum: MerchandiseSubType })
  @IsOptional()
  @IsEnum(MerchandiseSubType)
  merchandiseSubType?: MerchandiseSubType;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Chỉ lấy sản phẩm được gắn "Sản phẩm mới"',
  })
  @IsOptional()
  @Transform(parseQueryBoolean)
  @IsBoolean()
  isNew?: boolean;
}
