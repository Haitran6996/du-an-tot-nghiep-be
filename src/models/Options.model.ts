import mongoose, { Schema, Document } from 'mongoose'

export interface IOptions extends Document {
  color: string
  ram: string
  rom: string
  price: string
  chip: string
  card: string
  quatity: number
  image: string
}

const OptionsSchema: Schema = new Schema({
  ram: { type: String, required: true },
  color: { type: String, required: true },
  rom: { type: String, required: true },
  price: { type: String, required: true },
  chip: { type: String, required: true },
  card: { type: String, required: true },
  quatity: { type: Number, required: true },
  image: { type: String, default: null }
})

export default mongoose.model<IOptions>('options', OptionsSchema)
