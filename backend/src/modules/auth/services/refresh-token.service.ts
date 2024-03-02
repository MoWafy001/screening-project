import { Injectable } from '@nestjs/common';
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

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(user: UserDocument) {
    const payload: IJWTPayload = {
      sub: user._id.toString(),
      email: user.email,
      isRefreshToken: true,
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

    return token && !token.revoked && token.expiresAt > new Date();
  }

  async findByToken(token: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel.findOne({ token }).populate('user');
  }

  async revokeRefreshToken(token: string) {
    return this.refreshTokenModel.updateOne({ token }, { revoked: true });
  }

  async revokeAllForUser(user: UserDocument) {
    return this.refreshTokenModel.updateMany(
      { userId: user._id, revoked: false },
      { revoked: true },
    );
  }

  async deleteExpiredForUser(user: UserDocument) {
    return this.refreshTokenModel.deleteMany({
      userId: user._id,
      expiresAt: { $lt: new Date() },
    });
  }
}
