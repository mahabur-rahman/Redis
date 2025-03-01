import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    RedisModule, // RedisModule যোগ করা হয়েছে
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductModule {}
