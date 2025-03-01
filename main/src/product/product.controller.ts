import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products (Returns products from Redis or MongoDB)
  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  // Create a new product (Saves the product to MongoDB and updates Redis cache)
  @Post()
  async createProduct(@Body() productDto: any) {
    return this.productsService.createProduct(productDto);
  }
}
