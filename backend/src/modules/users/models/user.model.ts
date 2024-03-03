import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { hashPassword } from 'src/helpers/password';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  password: string;

  @Prop()
  authenticatorSecret: string;

  @Prop()
  OtpAuthUrl: string;

  @Prop({ default: false })
  twoFAEnabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// on create hook
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const sec = speakeasy.generateSecret({
      name: `${this.firstName}@ThisApp`,
    });

    this.authenticatorSecret = sec.base32;
    this.OtpAuthUrl = sec.otpauth_url;
  }

  // hash password if not hashed
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});
