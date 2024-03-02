import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('mailer', () => ({
  host: Env.get('MAILER_HOST').toString(),
  port: Env.get('MAILER_PORT').toNumber(),
  secure: Env.get('MAILER_SECURE').toBoolean(),
  auth: {
    user: Env.get('MAILER_USER').toString(),
    pass: Env.get('MAILER_PASS').toString(),
  },
  from: Env.get('MAILER_FROM').toString(),
}));
