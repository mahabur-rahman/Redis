import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products
  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  // Create a new product
  @Post()
  async createProduct(@Body() productDto: any) {
    return this.productsService.createProduct(productDto);
  }

  // Update a product by ID
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateDto: any) {
    return this.productsService.updateProduct(id, updateDto);
  }

  // Delete a product by ID
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
