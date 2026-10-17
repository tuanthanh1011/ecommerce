import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

/**
 * Shape is enforced by sanitizeHomeSettings() (whitelist + clamp), so the DTO
 * only needs to let the top-level blocks through the global ValidationPipe.
 */
export class UpdateHomeSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  hero?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  story?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  space?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  sections?: Record<string, unknown>;
}
