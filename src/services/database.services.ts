import mongoose from 'mongoose'
import VariantSchema, { IVariant } from 'src/models/Variant.models'
import OptionsSchema, { IOptions } from 'src/models/Options.model'
import ProductSchema, { IProduct } from 'src/models/Products.models'

const uri = 'mongodb+srv://datn:UDISDKLPOS@cluster0.ncfvzoh.mongodb.net/?retryWrites=true&w=majority'

class DatabaseService {
  constructor() {
    this.connect()
  }

  async connect() {
    try {
      await mongoose.connect(uri)
      console.log('You successfully connected to MongoDB with Mongoose!')
    } catch (error) {
      console.error('Error connecting to MongoDB', error)
      throw error
    }
  }

  get variants(): mongoose.Model<IVariant> {
    return VariantSchema
  }

  get options(): mongoose.Model<IOptions> {
    return OptionsSchema
  }

  get products(): mongoose.Model<IProduct> {
    return ProductSchema
  }
}

const databaseService = new DatabaseService()
export default databaseService
