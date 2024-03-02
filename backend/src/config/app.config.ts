import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('app', () => ({
  port: Env.get('PORT', 3000).toNumber(),
}));
