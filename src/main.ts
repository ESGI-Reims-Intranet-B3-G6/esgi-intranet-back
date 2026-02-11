import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import ConfigConstants from './config-constants';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { accessControlHeader, setFrontendUrl } from './middlewares';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ESGI Backend API')
    .setDescription("La documentation de l'API Backend de l'intranet de l'ESGI")
    .addTag('intranet')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs/', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<string>(ConfigConstants.appPort);

  setFrontendUrl(configService.getOrThrow<string>(ConfigConstants.frontendUrl));
  app.use(accessControlHeader);

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
