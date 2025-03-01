import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Redis } from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject('REDIS') private readonly redis: Redis, // Redis ক্লায়েন্ট ইনজেক্ট করা
  ) {}

  async getProducts(): Promise<Product[]> {
    const cachedProducts = await this.redis.get('products');

    if (cachedProducts) {
      console.log('Returning from cache');
      return JSON.parse(cachedProducts);
    } else {
      const products = await this.productModel.find().exec();
      await this.redis.set('products', JSON.stringify(products), 'EX', 3600); // 1 ঘণ্টা cache
      console.log('Returning from MongoDB');
      return products;
    }
  }

  async createProduct(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    return newProduct.save();
  }
}
