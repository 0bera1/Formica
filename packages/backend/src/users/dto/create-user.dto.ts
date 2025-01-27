import { IsString, IsEmail, MinLength } from 'class-validator';
// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @MinLength(6)
  password: string;
}
