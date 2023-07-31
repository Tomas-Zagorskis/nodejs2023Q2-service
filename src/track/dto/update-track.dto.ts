import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
  })
  name?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is a optional property',
  })
  duration?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
  })
  albumId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
  })
  artistId?: string;
}
