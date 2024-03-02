import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Post('login')
  //   async login(@Body() loginDto: LoginDto) {
  //     return this.authService.login(loginDto);
  //   }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = this.authService.signup(signupDto);
    return serialize(user, UserSerialization);
  }
}
