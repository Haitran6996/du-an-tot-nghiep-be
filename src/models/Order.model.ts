import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: any
  status: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  items: [],
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'completed', 'shipped', 'cancelled'], // Ví dụ về các giá trị enum
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<IOrder>('Order', OrderSchema)
