import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamMemberGroup } from '../../../common/enums';

export class CreateTeamMemberDto {
  @ApiProperty({ enum: TeamMemberGroup })
  @IsEnum(TeamMemberGroup)
  group: TeamMemberGroup;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoId?: string;
}
