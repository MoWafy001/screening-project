import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as speakeasy from 'speakeasy';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  password: string;

  @Prop()
  authenticatorSecret: string;

  @Prop()
  OtpAuthUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// on create hook
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    const sec = speakeasy.generateSecret({
      name: `${this.firstName}@ThisApp`,
    });

    this.authenticatorSecret = sec.base32;
    this.OtpAuthUrl = sec.otpauth_url;
  }
  next();
});
