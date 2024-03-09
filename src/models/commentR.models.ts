import mongoose, { Schema, Document } from 'mongoose'
import { IReply } from './CmtReply.models'
export interface ICmtReply extends Document {
    userId: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    comment: string
    reply: number
}

const CommentReplySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    comment: { type: String, require: true },
    reply: {type: Number, default:0}
},
    {
        timestamps: true,
    }

)

export default mongoose.model<ICmtReply>('comment-reply', CommentReplySchema)
