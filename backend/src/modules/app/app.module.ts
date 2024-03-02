import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../../config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from 'src/config/db.config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import jwtConfig from 'src/config/jwt.config';
import { AppController } from './controllers/app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import mailerConfig from 'src/config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, jwtConfig, mailerConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService) => ({
        uri: configService.get('db.uri'),
        dbName: configService.get('db.dbName'),
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('mailer'));

        return {
          transport: {
            host: configService.get('mailer.host'),
            port: configService.get('mailer.port'),
            secure: configService.get('mailer.secure'),
            auth: {
              user: configService.get('mailer.auth.user'),
              pass: configService.get('mailer.auth.pass'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get('mailer.from')}>`,
          },
          template: {
            dir: __dirname + '/../../resources/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
