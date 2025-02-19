import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // Corrected: Only call listen once with the port number
  const port = process.env.PORT || 8001;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();
