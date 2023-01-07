import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(6, 32)
  @IsOptional()
  password: string;
}
