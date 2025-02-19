import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://pappqdwm:l4izHFOY4545iHrsFbHPW8yGq7osjyYb@seal.lmq.cloudamqp.com/pappqdwm',
      ],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Corrected: Remove the callback from `listen()`
  await app.listen();
  console.log(`Microservice is listening...`);
}
bootstrap();
