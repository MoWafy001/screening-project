import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { JsonResponse } from 'src/lib/responses/json-response';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenService } from '../services/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken } = await this.authService.login(loginDto);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });

    return new JsonResponse({
      data: {
        user: serialize(user, UserSerialization),
      },
    });
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    return new JsonResponse({
      data: {
        user: serialize(user, UserSerialization),
      },
    });
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.refreshTokenService.refreshAccessToken(refreshTokenDto.token);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });

    return new JsonResponse({
      data: {
        user: serialize(user, UserSerialization),
        refreshToken,
      },
    });
  }
}
