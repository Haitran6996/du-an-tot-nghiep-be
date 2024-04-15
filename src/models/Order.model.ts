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
  desc: string
  user_cancel_order: mongoose.Types.ObjectId
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  user_cancel_order: { type: Schema.Types.ObjectId, ref: 'users', default: null },
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
  desc: { type: String, default: null },
  totalAmount: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<IOrder>('Order', OrderSchema)
