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

  @Prop()
  password: string;

  @Prop()
  authenticatorSecret: string;

  @Prop()
  OtpAuthUrl: string;

  generateAuthenticatorSecret(): void {
    const sec = speakeasy.generateSecret({
      name: `${this.firstName}@ThisApp`,
    });

    this.authenticatorSecret = sec.base32;
    this.OtpAuthUrl = sec.otpauth_url;
  }

  isValidateOtp(otp: string): boolean {
    return speakeasy.totp.verify({
      secret: this.authenticatorSecret,
      encoding: 'base32',
      token: otp,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
