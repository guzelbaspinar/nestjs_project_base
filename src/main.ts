import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    /**
     * To disable logging, set the logger property to false in the (optional) Nest application options object passed as the second argument to the NestFactory.create() method.
     */
    // logger: console,
    cors: true,
  });
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      /**
       * Payloads coming in over the network are plain JavaScript objects.
       * The ValidationPipe can automatically transform payloads to be objects typed according to their DTO classes.
       * To enable auto-transformation, set transform to true. This can be done at a method level:
       */
      transform: true,
      /**
       * Our ValidationPipe can also filter out properties that should not be received by the method handler.
       * In this case, we can whitelist the acceptable properties, and any property not included in the whitelist is automatically stripped from the resulting object.
       * For example, if our handler expects email and password properties, but a request also includes an age property, this property can be automatically removed from the resulting DTO.
       * To enable such behavior, set whitelist to true.
       */
      whitelist: true, // any property not included in the whitelist is automatically stripped from the resulting object.
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.use(morgan('tiny'));

  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: {
        admin: '12345678',
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Nestjs example')
    .setDescription('The nestjs sample API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth({
      description: 'add JWT token',
      type: 'http',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
