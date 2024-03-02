import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('jwt', () => ({
  secret: Env.get('JWT_SECRET').toString(),
  expiresIn: Env.get('JWT_EXPIRES_IN').toString(),
}));
