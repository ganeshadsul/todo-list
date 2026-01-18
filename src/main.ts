import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away fields not in the DTO
      forbidNonWhitelisted: true, // Throws error if extra fields are sent
      transform: true, // Automatically transforms types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
