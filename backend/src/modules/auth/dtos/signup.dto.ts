import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
