import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Redis } from 'ioredis'; // Import Redis for caching

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  // Get all products (First check Redis, if not found fetch from MongoDB)
  async getProducts(): Promise<Product[]> {
    const cachedProducts = await this.redis.get('products');

    if (cachedProducts) {
      console.log('Returning from cache');
      return JSON.parse(cachedProducts);
    } else {
      const products = await this.productModel.find().exec();
      await this.redis.set('products', JSON.stringify(products), 'EX', 3600);
      console.log('Returning from MongoDB');
      return products;
    }
  }

  // Create a new product (Save in MongoDB and update the Redis cache)
  async createProduct(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    await newProduct.save();
    await this.updateRedisCache();
    return newProduct;
  }

  // Update a product (Find by ID and update in MongoDB, then update Redis)
  async updateProduct(id: string, updateDto: any): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (updatedProduct) {
      await this.updateRedisCache(); // Refresh cache after update
    }
    return updatedProduct;
  }

  // Delete a product (Find by ID and remove, then update Redis)
  async deleteProduct(id: string): Promise<{ deleted: boolean }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (result) {
      await this.updateRedisCache(); // Refresh cache after delete
      return { deleted: true };
    }
    return { deleted: false };
  }

  // Update the Redis cache with the current products in MongoDB
  private async updateRedisCache() {
    const products = await this.productModel.find().exec();
    await this.redis.set('products', JSON.stringify(products), 'EX', 3600);
    console.log('Updated Redis cache with new products');
  }
}
