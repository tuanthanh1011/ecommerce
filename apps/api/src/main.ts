import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust the first hop's X-Forwarded-For (reverse proxy / Cloudflare in
  // front of the VPS) so req.ip and rate limiting see the real client IP
  // instead of the proxy's.
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const corsOrigin = configService.get<string>('CORS_ORIGIN') ?? '*';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('S+ CMS API')
    .setDescription('Internal CMS API for S+ coffee shop')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT') ?? 3001;
  await app.listen(port);
}
void bootstrap();
