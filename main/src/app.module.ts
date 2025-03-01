import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { RedisModule } from './redis/redis.module'; // RedisModule ইমপোর্ট করা হয়েছে
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mahabur:mahabur@cluster0.2b3niye.mongodb.net/microservice_main',
    ),
    ProductModule,
    RedisModule, // RedisModule যোগ করা হয়েছে
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
