import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  newPassword: string;
}
