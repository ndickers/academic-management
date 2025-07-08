/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [`${process.env.CLIENT_URL}`, `${process.env.CLIENT_NET}`],
      credentials: true,
    },
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/files',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
