import mongoose, { Schema, Document } from 'mongoose'

export interface ISlider extends Document {
    productId: mongoose.Types.ObjectId
    image: string
    content: string

}

const SliderSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    image: { type: String, require: true },
    content: { type: String, require: true }
},
    {
        timestamps: true,
    }

)

export default mongoose.model<ISlider>('slider', SliderSchema)
