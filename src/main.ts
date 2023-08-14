import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { LoggingService } from './logging/logging.service';

const PORT = +process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const loggingService = app.get(LoggingService);

  app.useLogger(app.get(LoggingService));

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  process.on('uncaughtException', (error) => {
    loggingService.error('Uncaught Exception', error.stack);
  });

  process.on('unhandledRejection', (reason: Error) => {
    loggingService.error('Unhandled Rejection', reason.stack);
  });

  const config = new DocumentBuilder()
    .setTitle('Home Music Library')
    .setDescription('An API with CRUD functionality')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
