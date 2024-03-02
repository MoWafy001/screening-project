import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../../config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from 'src/config/db.config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService) => {
        return {
          uri: configService.get('db.uri'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
