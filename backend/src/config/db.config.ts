import { registerAs } from '@nestjs/config';
import { Env } from 'src/lib/env/env';

export default registerAs('db', () => ({
  uri: Env.get('MONGO_URI').toString(),
  dbName: Env.get('MONGO_DB_NAME').toString(),
}));
