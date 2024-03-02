import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('jwt', () => ({
  secret: Env.get('JWT_SECRET').toString(),
  expiresIn: Env.get('JWT_EXPIRES_IN', '30m').toString(),
  refreshSecret: Env.get('JWT_REFRESH_EXPIRES_IN', '7d').toString(),
}));
