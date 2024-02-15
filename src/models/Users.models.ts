import mongoose, { Schema, Document } from 'mongoose'

export interface IUsers extends Document {
  name: string
  mail: string
  password: string
  image: string
  role: number
}

const UsersSchema: Schema = new Schema({
  name: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  role: { type: Number, required: true }
})

export default mongoose.model<IUsers>('users', UsersSchema)
