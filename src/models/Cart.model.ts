// models/Cart.js
import mongoose, { Schema, Document } from 'mongoose'

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId // Liên kết giỏ hàng với người dùng
  items: {
    product: mongoose.Types.ObjectId
    options: mongoose.Types.ObjectId[]
    quantity: number
  }[]
  totalAmount: number
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
      options: [{ type: Schema.Types.ObjectId, ref: 'options' }],
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number }
})

export default mongoose.model<ICart>('Cart', CartSchema)
