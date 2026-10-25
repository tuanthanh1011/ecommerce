import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * Shapes are enforced by sanitizeInternalNotices()/sanitizeInternalPeople()
 * (whitelist + clamp); the DTOs only let the fields through the global
 * ValidationPipe.
 */
export class UpdateInternalNoticesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: 'Hiện logo S+ COFFEE mờ làm nền' })
  @IsOptional()
  @IsBoolean()
  showWatermark?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tocTitle?: string;

  @ApiPropertyOptional({ description: 'Mục lục: [{ title, url }]' })
  @IsOptional()
  @IsArray()
  items?: unknown[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closing?: string;
}

export class UpdateInternalPeopleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: 'Hiện logo S+ COFFEE mờ làm nền' })
  @IsOptional()
  @IsBoolean()
  showWatermark?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lead?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  highlight?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detailTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closing?: string;
}
