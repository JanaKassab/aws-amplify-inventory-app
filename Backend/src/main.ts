import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('API for managing products in a store or warehouse')
    .setVersion('1.0')
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customJs: 'custom.js',
    customfavIcon: 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png',
    customSiteTitle: "Jana's API Documentation",
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
