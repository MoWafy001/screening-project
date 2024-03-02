import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/modules/users/models/user.model';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signLoginJWTFor(user: UserDocument, twoFA: boolean = false) {
    const payload: IJWTPayload = {
      email: user.email,
      sub: user._id.toString(),
      twoFA,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
  }

  async login(loginDto: any) {
    const user = await this.usersService.findOne(loginDto);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      accessToken: this.signLoginJWTFor(user),
    };
  }

  async signup(signupDto: SignupDto) {
    return this.usersService.create(signupDto);
  }

  async validate2FA(user: UserDocument, otp: string) {
    const isValid = speakeasy.totp.verify({
      secret: user.authenticatorSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA OTP');
    }

    return this.signLoginJWTFor(user, true);
  }
}
