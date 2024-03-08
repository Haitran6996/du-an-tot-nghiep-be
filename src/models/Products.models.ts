import mongoose, { Schema, Document } from 'mongoose'
import { IOptions } from './Options.model'

export interface IProduct extends Document {
  name: string
  date: string
  description: string
  thumbnail: string
  price: number
  options: IOptions['_id'][]
  purchases: number
  categoryId: string
  view: number
  rating: number
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  thumbnail: { type: String, required: true },
  purchases: { type: Number, default: 0 },
  price: { type: Number, required: true },
  view: { type: Number, default: 0, require: false },
  rating: {
    type: Number, default: 5, enum: {
      values: [1, 2, 3, 4, 5],
      message: '{VALUE} không được phép'
    }
  },
  options: [{ type: Schema.Types.ObjectId, ref: 'options' }]
})

export default mongoose.model<IProduct>('product', ProductSchema)
