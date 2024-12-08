import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger dokümantasyonu yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for the task management system')
    .setVersion('1.0')
    .addTag('tasks') // Burada 'tasks' tag'ini Swagger'e ekliyoruz
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' yolu üzerinden erişilecek

  await app.listen(3000);
}
bootstrap();
