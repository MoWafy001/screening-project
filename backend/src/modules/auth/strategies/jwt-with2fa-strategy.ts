import { Request } from 'express';
import { IJWTPayload } from 'src/common/interfaces/jwt-payload.interface';
import { createStrategy } from './create-strategy';

export class JwtWith2faStrategy extends createStrategy('jwt-with-2fa') {
  extraValidations({
    payload,
  }: {
    request: Request;
    payload: IJWTPayload;
  }): boolean | Promise<boolean> {
    return payload.twoFA;
  }
}
