import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: any
  status: string
  name: string
  phone: string
  address: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  items: [],
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'check', 'paid', 'completed', 'shipped', 'cancelled'], // Ví dụ về các giá trị enum
    default: 'pending'
  },
  totalAmount: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<IOrder>('Order', OrderSchema)
