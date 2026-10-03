import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

class ReorderItem {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  sortOrder: number;
}

export class ReorderTeamMembersDto {
  @ApiProperty({ type: [ReorderItem] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items: ReorderItem[];
}
