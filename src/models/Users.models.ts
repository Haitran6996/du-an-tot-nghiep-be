import mongoose, { Schema, Document } from 'mongoose'

export interface IUsers extends Document {
  username: string
  mail: string
  password: string
  image: string
  role: number
  refreshToken:string
  otp:string
}

const UsersSchema: Schema = new Schema({
  username: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String},
  role: { type: Number, required: true },
  refreshToken: { type: String},
  otp: { type: String }
})

export default mongoose.model<IUsers>('users', UsersSchema)
