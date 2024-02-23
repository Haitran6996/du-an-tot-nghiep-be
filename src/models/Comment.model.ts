import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    comment: string
}

const CommentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    comment: { type: String, require: true }
},
    {
        timestamps: true,
    }

)

export default mongoose.model<IComment>('comment', CommentSchema)
