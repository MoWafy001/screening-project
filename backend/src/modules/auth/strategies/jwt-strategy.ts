import { createStrategy } from './create-strategy';

export class JwtStrategy extends createStrategy('jwt') {
  async extraValidations() {
    return true;
  }
}
