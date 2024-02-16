import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
    name: string,
    image: string,
    description: string,
    status_news: number
    
}

const NewsSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    status_news: { type: Number, required: true },
},
    {
        timestamps: true,
    }
)

export default mongoose.model<INews>('news', NewsSchema)
