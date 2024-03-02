import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            message: 'Input data validation failed',
            errors: errors.reduce((acc, error: ValidationError) => {
              acc[error.property] = Object.values(error.constraints);
              return acc;
            }, {}),
          },
          422,
        );
      },
    }),
  );

  app.setGlobalPrefix('api/v1');
  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
