import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-strategy';
import { TwoFAController } from './controllers/two-fa.controller';
import { RefreshTokenService } from './services/refresh-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthController, TwoFAController],
  providers: [AuthService, JwtStrategy, RefreshTokenService],
})
export class AuthModule {}
