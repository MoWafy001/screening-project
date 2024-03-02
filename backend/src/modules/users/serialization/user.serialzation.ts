import { Expose } from 'class-transformer';

export class UserSerialization {
  @Expose({ name: 'id' })
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
