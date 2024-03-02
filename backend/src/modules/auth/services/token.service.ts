import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UserDocument } from 'src/modules/users/models/user.model';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signLoginJWTFor(user: UserDocument, twoFA: boolean = false) {
    const payload: IJWTPayload = {
      email: user.email,
      sub: user._id.toString(),
      type: 'access',
      twoFA,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
  }

  signEmailVerificationTokenFor(user: UserDocument) {
    const payload: IJWTPayload = {
      email: user.email,
      sub: user._id.toString(),
      type: 'emailVerification',
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('jwt.emailVerificationExpiresIn'),
    });
  }

  validateEmailVerificationToken(token: string): IJWTPayload {
    try {
      const payload: IJWTPayload = this.jwtService.verify(token);
      if (payload.type !== 'emailVerification')
        throw new Error('Invalid token type');
      return payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid email verification token');
    }
  }
}
