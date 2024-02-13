import mongoose, { Schema, Document } from 'mongoose'
import { IOptions } from './Options.model'

interface IProduct extends Document {
  name: string
  date: string
  description: string
  thumbnail: string
  options: IOptions['_id'][]
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  thumbnail: { type: String, required: true },
  options: [{ type: Schema.Types.ObjectId, ref: 'options' }]
})

export default mongoose.model<IProduct>('product', ProductSchema)
