import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  async createProduct(@Body() productDto: any) {
    return this.productsService.createProduct(productDto);
  }
}
