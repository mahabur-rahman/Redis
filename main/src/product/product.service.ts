import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // async findOne(id: string): Promise<Product> {
  //   return this.productModel.findById(id).exec();
  // }

  // async update(id: string, productDto: any): Promise<Product> {
  //   return this.productModel.findByIdAndUpdate(id, productDto, { new: true });
  // }

  // async delete(id: string): Promise<Product> {
  //   return this.productModel.findByIdAndDelete(id).exec();
  // }
}
