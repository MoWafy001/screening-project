import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class TwoFADto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsBoolean()
  rememberMe: boolean;
}
