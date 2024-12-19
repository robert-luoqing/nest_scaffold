import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filter/allExceptionsFilter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  app.use(bodyParser.json({ limit: '100mb' })); // 设置 JSON 请求体的大小限制为 10MB
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // 设置 URL encoded 请求体的大小限制为 10MB

  await app.listen(3020);
}
bootstrap();
