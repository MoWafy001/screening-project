import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { serialize } from 'src/helpers/serialize';
import { UserSerialization } from 'src/modules/users/serialization/user.serialzation';
import { Response } from 'express';
import { UserDocument } from 'src/modules/users/models/user.model';
import { TwoFADto } from '../dtos/2fa.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
export class TwoFAController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getSec(@CurrentUser() user: UserDocument) {
    return user.OtpAuthUrl;
  }

  @Post()
  async validate2FA(
    @Body() twoFADto: TwoFADto,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: UserDocument,
  ) {
    const accessToken = await this.authService.validate2FA(user, twoFADto.otp);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
    });

    return serialize(user, UserSerialization);
  }
}
