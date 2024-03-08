import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    rating:number
    comment: string
}

const CommentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    rating: {
        type: Number, default: 5, enum: {
          values: [1, 2, 3, 4, 5],
          message: '{VALUE} không được phép'
        }
      },
    comment: { type: String, require: true }
},
    {
        timestamps: true,
    }

)

export default mongoose.model<IComment>('comment', CommentSchema)
