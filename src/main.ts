import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // beech ki na3ml /backend ye5dem 
  app.setGlobalPrefix('backend')
  app.use(cookieParser());
  app.enableCors({
    origin:'http://localhost:3000',
    credentials:true})

  await app.listen(8000);
}
bootstrap();
