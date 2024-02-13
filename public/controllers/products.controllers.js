"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOptions = exports.deleteProducts = exports.addProductsVariant = exports.addProducts = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("src/services/database.services"));
const addProducts = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { name, description } = req.body;
        // Tạo sản phẩm mới với mảng options rỗng
        const productInsertion = await database_services_1.default.products.insertOne({
            name,
            description,
            options: [] // Mảng options rỗng
        });
        res.status(201).json({
            message: 'Product created successfully',
            productId: productInsertion.insertedId
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};
exports.addProducts = addProducts;
const addProductsVariant = async (req, res, next) => {
    const { productId } = req.params;
    const optionData = req.body;
    try {
        const optionInsertion = await database_services_1.default.options.insertOne(optionData);
        const optionId = optionInsertion.insertedId;
        await database_services_1.default.products.updateOne({ _id: new mongodb_1.ObjectId(productId) }, { $push: { options: new mongodb_1.ObjectId(optionId) } });
        res.status(201).json({
            message: 'Option created and added to product successfully',
            optionId: optionId
        });
    }
    catch (error) {
        console.error('Error adding option to product:', error);
        res.status(500).json({ message: 'Failed to add option to product', error: error.message });
    }
};
exports.addProductsVariant = addProductsVariant;
const deleteProducts = async (req, res, next) => {
    const { productId } = req.params;
    try {
        await database_services_1.default.products.deleteOne({ _id: new mongodb_1.ObjectId(productId) });
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};
exports.deleteProducts = deleteProducts;
const deleteOptions = async (req, res, next) => {
    const { productId, optionId } = req.params;
    try {
        await database_services_1.default.products.updateOne({ _id: new mongodb_1.ObjectId(productId) }, { $pull: { options: new mongodb_1.ObjectId(optionId) } } // Sử dụng $pull để loại bỏ optionId khỏi mảng options
        );
        // Tùy chọn: Xóa option khỏi collection options nếu không còn được tham chiếu
        await database_services_1.default.options.deleteOne({ _id: new mongodb_1.ObjectId(optionId) });
        res.status(200).json({
            message: 'Option removed from product successfully'
        });
    }
    catch (error) {
        console.error('Error removing option from product:', error);
        res.status(500).json({ message: 'Failed to remove option from product', error: error.message });
    }
};
exports.deleteOptions = deleteOptions;
