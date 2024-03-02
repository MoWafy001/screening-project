import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/modules/users/models/user.model';

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmailTo(user: UserDocument, token: string) {
    const host = this.configService.get('app.host');
    const url = `${host}/api/v1/auth/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        url,
      },
    });
  }
}
