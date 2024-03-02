import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/models/user.model';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ index: true, required: true })
  userId: string;

  @Prop({ type: User, ref: 'User' })
  user: User;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  revoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
