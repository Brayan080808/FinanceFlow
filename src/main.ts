// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';

// // Cargar las variables de entorno
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.use(cookieParser())
//   app.enableCors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
//   app.useGlobalPipes(new ValidationPipe())


//   await app.listen(3000);

// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Obtener el ConfigService

  app.use(cookieParser()); 
  
  // configService.get('config.cors_origin')
  app.enableCors({
    origin: configService.get('config.cors_origin'), // Usa la variable de entorno para CORS
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();