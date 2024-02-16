import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
    title: string,
    imageUrl: string,
    shortContent: string,
    content:string
    statusNews: number
}

const NewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    shortContent: { type: String, required: true },
    content: { type: String, required: true },
    statusNews: { type: Number, required: true },
},
    {
        timestamps: true,
    }
)

export default mongoose.model<INews>('news', NewsSchema)
