import mongoose from 'mongoose'
import VariantSchema, { IVariant } from '../models/Variant.models'
import OptionsSchema, { IOptions } from '../models/Options.model'
import ProductSchema, { IProduct } from '../models/Products.models'
import UsersSchema, { IUsers } from '../models/Users.models'
import NewsSchema, { INews } from '../models/News.models'
import CommentSchema, { IComment } from '../models/Comment.model'
import CartSchema, { ICart } from '../models/Cart.model'
import OrderSchema, { IOrder } from 'src/models/Order.model'
import GiftSchema, { IGift } from '../models/gift.model'
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
  get users(): mongoose.Model<IUsers> {
    return UsersSchema
  }
  get news(): mongoose.Model<INews> {
    return NewsSchema
  }
  get comments(): mongoose.Model<IComment> {
    return CommentSchema
  }
  get carts(): mongoose.Model<ICart> {
    return CartSchema
  }
  get orders(): mongoose.Model<IOrder> {
    return OrderSchema
    // get gifts():mongoose.Model<IGift>{
    //   return GiftSchema
    // }
  }
  get gifts(): mongoose.Model<IGift> {
    return GiftSchema
  }
}
const databaseService = new DatabaseService()
export default databaseService
