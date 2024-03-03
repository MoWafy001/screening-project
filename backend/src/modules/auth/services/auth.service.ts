import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserDocument } from 'src/modules/users/models/user.model';
import * as speakeasy from 'speakeasy';
import { EmailsService } from 'src/modules/emails/services/emails.service';
import { TokenService } from './token.service';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: any) {
    const user = await this.usersService.findOne(loginDto);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      accessToken: await this.tokenService.signLoginJWTFor(user),
    };
  }

  async signup(signupDto: SignupDto) {
    const newUser = await this.usersService.create(signupDto);

    const token =
      await this.tokenService.signEmailVerificationTokenFor(newUser);
    await this.emailsService.sendVerificationEmailTo(newUser, token);

    return newUser;
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

    return this.tokenService.signLoginJWTFor(user, true);
  }

  async verifyEmail(token: string) {
    const payload: IJWTPayload | boolean =
      this.tokenService.validateEmailVerificationToken(token);
    const user = await this.usersService.findById(payload.sub);
    user.emailVerified = true;
    await user.save();
    return user;
  }
}
