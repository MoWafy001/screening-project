import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { JsonResponse } from 'src/lib/responses/json-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken } = await this.authService.login(loginDto);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });

    const data = serialize(user, UserSerialization);
    return new JsonResponse({ data });
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    const data = serialize(user, UserSerialization);
    return new JsonResponse({ data });
  }
}
