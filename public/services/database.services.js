"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Variant_models_1 = __importDefault(require("../models/Variant.models"));
const Options_model_1 = __importDefault(require("../models/Options.model"));
const Products_models_1 = __importDefault(require("../models/Products.models"));
const Users_models_1 = __importDefault(require("../models/Users.models"));
const News_models_1 = __importDefault(require("../models/News.models"));
const Comment_model_1 = __importDefault(require("../models/Comment.model"));
const Cart_model_1 = __importDefault(require("../models/Cart.model"));
const Order_model_1 = __importDefault(require("src/models/Order.model"));
const gift_model_1 = __importDefault(require("../models/gift.model"));
const Category_model_1 = __importDefault(require("src/models/Category.model"));
const uri = 'mongodb+srv://datn:UDISDKLPOS@cluster0.ncfvzoh.mongodb.net/?retryWrites=true&w=majority';
class DatabaseService {
    constructor() {
        this.connect();
    }
    async connect() {
        try {
            await mongoose_1.default.connect(uri);
            console.log('You successfully connected to MongoDB with Mongoose!');
        }
        catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error;
        }
    }
    get variants() {
        return Variant_models_1.default;
    }
    get options() {
        return Options_model_1.default;
    }
    get products() {
        return Products_models_1.default;
    }
    get users() {
        return Users_models_1.default;
    }
    get news() {
        return News_models_1.default;
    }
    get comments() {
        return Comment_model_1.default;
    }
    get carts() {
        return Cart_model_1.default;
    }
    get orders() {
        return Order_model_1.default;
        // get gifts():mongoose.Model<IGift>{
        //   return GiftSchema
        // }
    }
    get gifts() {
        return gift_model_1.default;
    }
    get categorys() {
        return Category_model_1.default;
    }
}
const databaseService = new DatabaseService();
exports.default = databaseService;
