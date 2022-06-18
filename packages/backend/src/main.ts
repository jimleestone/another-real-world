import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ServerOptions, SwaggerOptions } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // load config
  const serverOptions = configService.get<ServerOptions>('server');
  const swaggerOptions = configService.get<SwaggerOptions>('swagger');

  app.setGlobalPrefix(serverOptions.globalPrefix);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // swagger
  const swaggerDocConfig = new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDocConfig);
  SwaggerModule.setup(swaggerOptions.path, app, document);
  await app.listen(serverOptions.port);
}
bootstrap();
