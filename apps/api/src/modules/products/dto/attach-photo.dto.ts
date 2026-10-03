import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AttachPhotoDto {
  @ApiProperty()
  @IsString()
  mediaId: string;
}
