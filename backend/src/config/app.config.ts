import { Env } from 'src/lib/env/env';

export default () => ({
  port: Env.get('PORT', 3000).toNumber(),
});
