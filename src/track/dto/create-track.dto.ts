import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  duration: number;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
  })
  artistId: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
  })
  albumId: string | null;
}
