import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import ConfigConstants from './config-constants';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow<string>(ConfigConstants.frontendUrl),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ESGI Backend API')
    .setDescription("La documentation de l'API Backend de l'intranet de l'ESGI")
    .addTag('intranet')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs/', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.getOrThrow<string>(ConfigConstants.appPort);

  await app.listen(port, () => {
    app
      .getUrl()
      .then((url: string) => {
        Logger.log(`Application listening at ${url}`);
      })
      .catch((err: Error) => {
        Logger.error(err.message);
      });
  });
}
bootstrap();
