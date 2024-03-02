import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IsStrongPassword } from 'src/common/validations/is-strong-password.validations';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
