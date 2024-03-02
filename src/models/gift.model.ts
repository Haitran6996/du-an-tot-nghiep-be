import mongoose, { Schema, Document } from 'mongoose'

export interface IGift extends Document {
    code: string
    start: Date
    expire: Date
    sale:number
    limit:number
    content: string
}

const GiftSchema: Schema = new Schema({
    code: { type: String, required: true },
    sale: {type: Number, require:true},
    start: {type: Date, require:true},
    expire: {type: Date, require:true},
    limit: {type: Number, require:true},
    content: { type: String, require: true }
},
    {
        timestamps: true,
    }

)

export default mongoose.model<IGift>('gift', GiftSchema)
