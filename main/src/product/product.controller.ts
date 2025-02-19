import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from './schema/product.schema';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // create product with rabbitMQ
  @EventPattern('product_created')
  async handleProductCreatedEvent(product: Product) {
    console.log('Received "product_created" event from RabbitMQ:', product);
    return this.productsService.create(product);
  }

  @Get()
  // @EventPattern('hello')
  async findAll(data: string): Promise<Product[]> {
    console.log('Received event for get all products : ', data);
    return this.productsService.findAll();
  }

  // ========================

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Product> {
  //   return this.productsService.findOne(id);
  // }

  @EventPattern('updated_product')
  async handleProductCreated(@Payload() product: Product) {
    console.log('New product created:', product);

    // Handle the event, such as saving it to the database or notifying users
    await this.productsService.create(product);
  }

  @EventPattern('product_deleted')
  async handleProductDeleted(@Payload() id: number) {
    console.log('Product deleted with ID:', id);
    // Handle deletion logic, such as removing it from cache or notifying users
  }
  // ===================== RABBITMQ ========================
  // @EventPattern('hello')
  // async hello(data: string) {
  //   console.log('Received event from admin product : ', data);
  // }
}
