import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET: সব পণ্য ফিরিয়ে আনবে
  @Get()
  async getProducts() {
    return this.productsService.getProducts(); // ProductsService থেকে পণ্য পেতে কল করবে
  }

  // POST: নতুন পণ্য তৈরি করবে
  @Post()
  async createProduct(@Body() productDto: any) {
    return this.productsService.createProduct(productDto); // ProductsService এ পণ্য তৈরি করতে কল করবে
  }
}
