import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';
import { Response } from 'express';
import { UserDocument } from 'src/modules/users/models/user.model';
import { TwoFADto } from '../dtos/2fa.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JsonResponse } from 'src/lib/responses/json-response';
import { RefreshTokenService } from '../services/refresh-token.service';

@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
export class TwoFAController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(200)
  @Get()
  async getSec(@CurrentUser() user: UserDocument) {
    const url = user.OtpAuthUrl;
    return new JsonResponse({
      data: {
        url,
      },
    });
  }

  @HttpCode(200)
  @Post()
  async validate2FA(
    @Body() twoFADto: TwoFADto,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: UserDocument,
  ) {
    // validate 2fa
    const accessToken = await this.authService.validate2FA(user, twoFADto.otp);

    // set access token
    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });

    // create response data
    const data: {
      data: UserSerialization;
      refreshToken?: string;
    } = {
      data: serialize(user, UserSerialization) as UserSerialization,
    };

    // if remember me is true, create refresh token
    if (twoFADto.rememberMe) {
      const refreshToken =
        await this.refreshTokenService.createToken(user);
      data.refreshToken = refreshToken.token;
    }

    // send response
    return new JsonResponse({ data });
  }
}
