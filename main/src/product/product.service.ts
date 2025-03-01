import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Redis } from 'ioredis'; // Import Redis for caching

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>, // MongoDB model
    @Inject('REDIS') private readonly redis: Redis, // Redis client
  ) {}

  // Get all products (First check Redis, if not found fetch from MongoDB)
  async getProducts(): Promise<Product[]> {
    const cachedProducts = await this.redis.get('products'); // Try to fetch from Redis

    if (cachedProducts) {
      console.log('Returning from cache');
      return JSON.parse(cachedProducts); // Return cached data
    } else {
      // If not found in Redis, fetch from MongoDB
      const products = await this.productModel.find().exec();

      // Cache the result in Redis for 1 hour (3600 seconds)
      await this.redis.set('products', JSON.stringify(products), 'EX', 3600);

      console.log('Returning from MongoDB');
      return products; // Return products from MongoDB
    }
  }

  // Create a new product (Save in MongoDB and update the Redis cache)
  async createProduct(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto);

    // Save the product in MongoDB
    await newProduct.save();

    // After saving in MongoDB, update the Redis cache
    await this.updateRedisCache();

    return newProduct;
  }

  // Update the Redis cache with the current products in MongoDB
  private async updateRedisCache() {
    const products = await this.productModel.find().exec(); // Get products from MongoDB
    await this.redis.set('products', JSON.stringify(products), 'EX', 3600); // Save to Redis for 1 hour
    console.log('Updated Redis cache with new products');
  }
}
