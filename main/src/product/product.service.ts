import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Redis } from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>, // MongoDB মডেল ইনজেক্ট করা
    @Inject('REDIS') private readonly redis: Redis, // Redis ক্লায়েন্ট ইনজেক্ট করা
  ) {}

  // সব পণ্য পাওয়া এবং Redis ক্যাশে চেক করা
  async getProducts(): Promise<Product[]> {
    const cachedProducts = await this.redis.get('products'); // Redis থেকে পণ্য দেখুন

    if (cachedProducts) {
      console.log('Returning from cache');
      return JSON.parse(cachedProducts); // যদি ক্যাশে থাকে, তবে Redis থেকে পণ্য ফিরিয়ে দিন
    } else {
      const products = await this.productModel.find().exec(); // MongoDB থেকে পণ্য নিয়ে আসুন
      await this.redis.set('products', JSON.stringify(products), 'EX', 3600); // Redis ক্যাশে ১ ঘণ্টার জন্য সেভ করুন
      console.log('Returning from MongoDB');
      return products; // MongoDB থেকে পণ্য ফেরত
    }
  }

  // নতুন পণ্য তৈরি করা
  async createProduct(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto); // নতুন পণ্য তৈরি করুন
    return newProduct.save(); // MongoDB এ পণ্য সেভ করুন
  }
}
