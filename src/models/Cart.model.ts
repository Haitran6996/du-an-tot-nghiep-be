// models/Cart.js
import mongoose, { Schema, Document } from 'mongoose'

interface ICart extends Document {
  userId: mongoose.Types.ObjectId // Liên kết giỏ hàng với người dùng
  items: {
    product: mongoose.Types.ObjectId
    options: mongoose.Types.ObjectId[]
    quantity: number
  }[]
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
      options: [{ type: Schema.Types.ObjectId, ref: 'options' }],
      quantity: { type: Number, required: true }
    }
  ]
})

export default mongoose.model<ICart>('Cart', CartSchema)
