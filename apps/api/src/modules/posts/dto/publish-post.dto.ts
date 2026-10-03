import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PublishPostDto {
  @ApiProperty()
  @IsBoolean()
  isPublished: boolean;
}
