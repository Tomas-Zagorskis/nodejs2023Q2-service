import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  password: string;
}
