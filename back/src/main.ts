import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { loggerGlobal } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'https://betaomega.vercel.app'],
    credentials: true,
  });

  app.use(loggerGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();