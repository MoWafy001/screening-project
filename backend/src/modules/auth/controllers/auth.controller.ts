import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { JsonResponse } from 'src/lib/responses/json-response';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenService } from '../services/refresh-token.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/modules/users/models/user.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(200)
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

  @HttpCode(201)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    return new JsonResponse({
      data: {
        user: serialize(user, UserSerialization),
      },
    });
  }

  @HttpCode(201)
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

  @HttpCode(200)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: UserDocument,
  ) {
    await this.refreshTokenService.deleteAllForUser(user);

    response.clearCookie('access_token');
    return new JsonResponse({
      message: 'Logged out',
    });
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    await this.authService.verifyEmail(token);
    return new JsonResponse({
      message: 'Email verified',
    });
  }
}
