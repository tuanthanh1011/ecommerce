import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';

const URL_OPTIONS = { require_protocol: true, protocols: ['http', 'https'] };

/**
 * Every field is optional: an empty/missing field means "do not show it".
 * URL fields accept '' (so the CMS can clear them) but otherwise must be a
 * real http(s) URL — they end up in href attributes on the public site.
 */
export class UpdateContactSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  openingHours?: string;

  @ApiPropertyOptional({ description: 'Câu cảm ơn ở chân trang' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  closingMessage?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsUrl(URL_OPTIONS)
  facebookUrl?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsUrl(URL_OPTIONS)
  instagramUrl?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsUrl(URL_OPTIONS)
  youtubeUrl?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsUrl(URL_OPTIONS)
  tiktokUrl?: string;

  @ApiPropertyOptional({ description: 'Link chat (Zalo, Messenger...)' })
  @ValidateIf((_, v) => v !== undefined && v !== '')
  @IsUrl(URL_OPTIONS)
  chatUrl?: string;
}
