import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop()
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
