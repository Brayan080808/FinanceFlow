import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser())
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())


  await app.listen(3000);

}
bootstrap();
