import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PostType } from '../../../common/enums';

export class PostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PostType })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiPropertyOptional({
    enum: PostType,
    description: 'Loại trừ một loại bài (vd. tách "Cho đi" khỏi "Tin tức")',
  })
  @IsOptional()
  @IsEnum(PostType)
  excludeType?: PostType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublished?: boolean;
}
