import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnLoginFilter } from './filter/unLogin.filter';
import { CustomExceptionFilter } from './filter/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const HOST = 5758

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('个人博客系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于JWT 认证',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);

  // 设置 API 版本
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'X-Api-Version',
  //   defaultVersion: '1',
  // });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  app.useGlobalFilters(new UnLoginFilter());

  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(HOST);

}
bootstrap();
