import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getCook } from 'src/helpers/cookie';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/services/users.service';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';

export const createStrategy = (name: string) => {
  abstract class JwtStrategy extends PassportStrategy(Strategy, name) {
    @Inject(UsersService) usersService: UsersService;

    constructor(@Inject(ConfigService) configService: ConfigService) {
      console.log('configService', configService.get('jwt.secret'));

      super({
        // from access_token cookie
        jwtFromRequest: ExtractJwt.fromExtractors([
          (request) => {
            return getCook('access_token', request.headers.cookie);
          },
        ]),
        ignoreExpiration: false,
        secretOrKey: configService.get('jwt.secret'),
        passReqToCallback: true,
      });
    }

    abstract extraValidations(props: {
      request: Request;
      payload: IJWTPayload;
    }): Promise<boolean> | boolean;

    async validate(request: Request) {
      try {
        const token = getCook('access_token', request.headers.cookie);
        const payload: IJWTPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;

        if (!(await this.extraValidations({ request, payload }))) {
          return false;
        }

        const user = await this.usersService.findById(userId);
        if (!user) {
          return false;
        }

        request.user = user;
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
    }
  }

  return JwtStrategy;
};
