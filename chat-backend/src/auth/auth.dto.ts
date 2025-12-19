import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
  @IsOptional() 
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}