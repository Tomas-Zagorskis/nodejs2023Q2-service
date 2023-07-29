import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  artistId: string | null;
  albumId: string | null;
}
