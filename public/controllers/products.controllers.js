"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.soSanh = exports.getProductById = exports.getAllProducts = exports.deleteOptions = exports.deleteProducts = exports.addProductsVariant = exports.addProducts = exports.filterPrice = exports.paginationProduct = void 0;
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
(0, express_1.Router)({ mergeParams: true });
const paginationProduct = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 24;
            const p = 1;
        }
        const data = await database_services_1.default.products.aggregate([
            { $match: {} },
            { $skip: Number(p) * Number(n) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.products.aggregate([{ $match: {} }, { $count: 'total' }]);
        const Total = total[0].total;
        res.status(201).json({ data, p, n, Total });
    }
    catch (error) {
        console.error('Error get data:', error);
        res.status(500).json({ message: 'Failed to data', error: error.message });
    }
};
exports.paginationProduct = paginationProduct;
const filterPrice = async (req, res, next) => {
    try {
        const { categoryId } = req.body;
        const data = await database_services_1.default.products.aggregate([
            { $match: ({ 'categoryId': categoryId }) },
            {
                $project: {
                    '0-9999999': { $cond: { $if: { $gte: 0, $lte: 9999999 }, $then: true, $else: false } },
                    '10000000-20000000': { $cond: { $if: { $gte: ['price', 10000000], $lte: 20000000 }, $then: true, $else: false } },
                    '20000001-30000000': { $cond: { $if: { $gte: ['price', 20000001], $lte: 30000000 }, $then: true, $else: false } },
                    '30000001-40000000': { $cond: { $if: { $gte: ['price', 30000001], $lte: 40000000 }, $then: true, $else: false } },
                    '40000001-50000000': { $cond: { $if: { $gte: ['price', 40000001], $lte: 50000000 }, $then: true, $else: false } },
                    '50000000+': { $cond: { $if: { $gte: ['price', 50000001] }, $then: true, $else: false } }
                }
            },
            {
                $group: { _id: { 'duoi-10tr': '$0-9999999', '10-20tr': '$10000000-20000000', 'tren-20tr': '$20000001-30000000', 'tren-30tr': '$30000001-40000000', 'tren-40tr': '$30000001-40000000', 'tren-50tr': '$50000000+' }, count: { $sum: 1 } }
            }
        ]);
        res.status(201).json({ data });
    }
    catch (error) {
        console.error('Error get product:', error);
        res.status(500).json({ message: 'Failed to get product', error: error.message });
    }
};
exports.filterPrice = filterPrice;
const addProducts = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { name, description, price, date, thumbnail } = req.body;
        // Tạo sản phẩm mới với mảng options rỗng
        const productInsertion = await database_services_1.default.products.create({
            name,
            description,
            price,
            date,
            thumbnail,
            options: [] // Mảng options rỗng
        });
        res.status(201).json({
            message: 'Product created successfully',
            productId: productInsertion._id
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
        const optionInsertion = await database_services_1.default.options.create(optionData);
        const optionId = optionInsertion._id;
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
const getAllProducts = async (req, res) => {
    try {
        const { name, sort } = req.query;
        let query = {};
        if (name) {
            query = {
                ...query,
                name: { $regex: new RegExp(name.toString(), 'i') }
            };
        }
        let products;
        if (sort === 'purchases') {
            // Sắp xếp theo số lượng mua giảm dần và giới hạn số lượng sản phẩm trả về
            products = await database_services_1.default.products.find(query).sort({ purchases: -1 }); // Sắp xếp theo số lượng mua giảm dần
        }
        else {
            products = await database_services_1.default.products.find(query);
        }
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const pipeline = [
            { $match: { _id: new mongodb_1.ObjectId(productId) } },
            {
                $lookup: {
                    from: 'options',
                    localField: 'options',
                    foreignField: '_id',
                    as: 'optionsDetails'
                }
            }
        ];
        const result = await database_services_1.default.products.aggregate(pipeline);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};
exports.getProductById = getProductById;
const soSanh = async (req, res) => {
    const array = [];
    if (req.params.id1 && req.params.id2) {
        array.push(req.params.id1);
        array.push(req.params.id2);
    }
    if (req.params.id3) {
        array.push(req.params.id3);
    }
    try {
        const data = [];
        for (let index = 0; index < array.length; index++) {
            const product = await database_services_1.default.products.findById(array[index]);
            data.push(product);
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};
exports.soSanh = soSanh;
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log(req.params.id, 'req.params.id');
        const updateData = req.body; // Dữ liệu cập nhật được gửi từ client
        // Tìm sản phẩm để cập nhật
        const product = await database_services_1.default.products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        // Cập nhật chỉ các thuộc tính được gửi từ client
        Object.keys(updateData).forEach((key) => {
            product[key] = updateData[key];
        });
        // Lưu sản phẩm đã cập nhật
        await product.save();
        // Trả về thông tin sản phẩm đã cập nhật
        res.json({ message: 'Cập nhật sản phẩm thành công', product });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm' });
    }
};
exports.updateProduct = updateProduct;
