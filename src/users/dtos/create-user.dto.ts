import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 32)
  password: string;
}
