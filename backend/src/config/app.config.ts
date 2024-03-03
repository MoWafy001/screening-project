import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('app', () => ({
  port: Env.get('PORT', 3000).toNumber(),
  host: Env.get(
    'HOST',
    `http://localhost:${Env.get('PORT', 3000).toNumber()}`,
  ).toString(),
  allowedOrigins: Env.get('ALLOWED_ORIGINS', '').toString().split(','),
}));
