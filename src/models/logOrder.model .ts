import mongoose, { Schema, Document } from 'mongoose'

export interface ILogOder extends Document {
  userId: mongoose.Types.ObjectId
  orderId: mongoose.Types.ObjectId
  role: number
  newStatus: string
  oldStatus: string
  priceOrder: number
  note: string
}

const logOrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  orderId: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  role: { type: String },
  priceOrder: { type: Number, required: true },
  oldStatus: {
    type: String, enum: {
      values: ['none', 'pending', 'check', 'paid', 'completed', 'shipped', 'cancelled'],
      message: '{VALUE} không được phép'
    }
  },
  newStatus: {
    type: String, enum: {
      values: ['pending', 'check', 'paid', 'completed', 'shipped', 'cancelled'],
      message: '{VALUE} không được phép'
    }
  },
  note: {type: String}
},
  {
    timestamps: true,
  }
)

export default mongoose.model<ILogOder>('LogOrder', logOrderSchema)
