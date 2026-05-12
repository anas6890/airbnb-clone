import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true, // permet l'envoi des cookies et headers Authorization
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // retourne une erreur si des champs inconnus sont envoyés
      transform: true, // convertit automatiquement les types (string → number etc.)
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
