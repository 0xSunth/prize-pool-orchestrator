import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors);
        throw new BadRequestException(errors);
      },
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  app.use((req: any, res: any, next: any) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Sotiras')
    .setDescription('Official Sotiras API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const host = configService.get('HOST');

  await app.listen(port, host, () => {
    console.log(`[SERVER] Running on ${host}:${port}`);
  });
}

bootstrap();
