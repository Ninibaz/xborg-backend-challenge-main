import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get('HTTP.PORT');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(config.get('HTTP.VERSION'));

  await app.listen(port, async () => {
    console.log('[GATEWAY]', config.get('HTTP.BASE_URL'));
  });
}

bootstrap();
