import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
    name: string,
    status_news: number,
    description: string,
    date_create: Date,
    date_update: Date
}

const NewsSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status_news: { type: Number, required: true },
    date_create: { type: Date, require: true },
    date_update: { type: Date, require: false }
})

export default mongoose.model<INews>('news', NewsSchema)
