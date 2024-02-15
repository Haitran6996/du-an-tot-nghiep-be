import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
  name: string
  status_news: number
  description: string
}

const NewsSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status_news: { type: Number, required: true },
})

export default mongoose.model<INews>('news', NewsSchema)
