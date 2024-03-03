import { Expose } from 'class-transformer';
import { UserSerialization } from './user.serialzation';

export class UserDetailsSerialization extends UserSerialization {
  @Expose()
  emailVerified: boolean;
}
