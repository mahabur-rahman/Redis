import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mahabur:mahabur@cluster0.2b3niye.mongodb.net/microservice_main',
    ),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
