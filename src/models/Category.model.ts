import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
    name: string
    image: string
}

const CategorySchema: Schema = new Schema({
    name: { type: String, require: true },
    image: { type: String, require: true }
}
)

export default mongoose.model<ICategory>('category', CategorySchema)
