import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../models/refresh-token.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/modules/users/models/user.model';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { TokenService } from './token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshAccessToken(oldRefreshToken: string) {
    // get refresh record token
    const token = await this.findByToken(oldRefreshToken);

    // check if token is valid
    if (!token || !this.isValid(token)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // get user
    const user = token.user;

    // create access token
    const newAccessToken = await this.tokenService.signLoginJWTFor(user, true);

    // create new refresh token
    const newRefreshToken = await this.createToken(user);

    // delete old refresh token
    await this.deleteByToken(oldRefreshToken);

    // delete expired refresh tokens
    await this.deleteExpiredForUser(user);

    // return access token and refresh token
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      user,
    };
  }

  async createToken(user: UserDocument) {
    const payload: IJWTPayload = {
      sub: user._id.toString(),
      email: user.email,
      type: 'refresh',
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const expiresAt = new Date(
      Date.now() + ms(this.configService.get('JWT_REFRESH_EXPIRES_IN')),
    );

    const refreshToken = new this.refreshTokenModel({
      token,
      userId: user._id,
      user,
      expiresAt,
    });

    return refreshToken.save();
  }

  async isValid(token: RefreshTokenDocument | string): Promise<boolean> {
    if (typeof token === 'string') {
      token = await this.findByToken(token);
    }

    try {
      this.jwtService.verify(token?.token);
    } catch (error) {
      return false;
    }

    return token && token.expiresAt > new Date();
  }

  async findByToken(token: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel.findOne({ token }).populate('user');
  }

  async deleteExpiredForUser(user: UserDocument) {
    return this.refreshTokenModel.deleteMany({
      userId: user._id,
      expiresAt: { $lt: new Date() },
    });
  }

  async deleteAllForUser(user: UserDocument) {
    return this.refreshTokenModel.deleteMany({ userId: user._id });
  }

  async deleteByToken(token: string) {
    return this.refreshTokenModel.deleteOne({ token });
  }
}
