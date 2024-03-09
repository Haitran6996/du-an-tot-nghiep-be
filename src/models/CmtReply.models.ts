import mongoose, { Schema, Document } from 'mongoose'

export interface IReply extends Document {
    userId: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    commentRId: mongoose.Types.ObjectId
    comment: string
    status: number
}

const ReplySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Giả sử bạn có một User model
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    commentRId: { type: Schema.Types.ObjectId, ref: 'commentR', required: true },
    comment: { type: String, require: true },
    status: { type: Number, default: 0 }
},
    {
        timestamps: true,
    }

)

export default mongoose.model<IReply>('reply', ReplySchema)
