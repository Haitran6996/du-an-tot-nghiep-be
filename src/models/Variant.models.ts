// variantModel.ts
import mongoose, { Schema, Document } from 'mongoose'

// Định nghĩa interface cho từng phần tử trong mảng
interface IArrayElement {
  id: mongoose.Types.ObjectId
  value: string
}

export interface IVariant extends Document {
  ram: IArrayElement[]
  rom: IArrayElement[]
  color: IArrayElement[]
  chip: IArrayElement[]
  card: IArrayElement[]
  //   price: number
}

// Schema cho từng phần tử trong mảng
const ArrayElementSchema: Schema = new Schema({
  id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), required: true },
  value: { type: String, required: true }
})

// Schema cho Variant
const VariantSchema: Schema = new Schema({
  ram: [ArrayElementSchema],
  rom: [ArrayElementSchema],
  color: [ArrayElementSchema],
  chip: [ArrayElementSchema],
  card: [ArrayElementSchema]
  //   price: { type: Number, required: true }
})

export default mongoose.model<IVariant>('variant', VariantSchema)
