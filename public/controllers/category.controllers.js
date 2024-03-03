"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameById = exports.getOneCategory = exports.getAllCategory = exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.paginationCategory = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationCategory = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 10;
            const p = 1;
        }
        const data = await database_services_1.default.categorys.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.categorys.aggregate([
            { $count: "total" }
        ]);
        const Total = total[0].total;
        res.status(201).json({ data, p, n, Total });
    }
    catch (error) {
        console.error('Error get data:', error);
        res.status(500).json({ message: 'Failed to data', error: error.message });
    }
};
exports.paginationCategory = paginationCategory;
const addCategory = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { name, image } = req.body; // Mảng options rỗng
        const CategoryInsertion = await database_services_1.default.categorys.create({
            name,
            image
        });
        res.status(201).json({
            message: 'Categorycode created successfully',
            CategoryId: CategoryInsertion
        });
    }
    catch (error) {
        console.error('Error create Category:', error);
        res.status(500).json({ message: 'Failed to create Category', error: error.message });
    }
};
exports.addCategory = addCategory;
const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, image } = req.body;
    try {
        const updateResult = await database_services_1.default.categorys.findByIdAndUpdate({ _id: categoryId }, {
            name: name,
            image: image,
        });
        res.status(200).json({ message: 'Cập nhật Category thành công' });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật Categorycode:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật Categorycode' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    try {
        await database_services_1.default.categorys.deleteOne({ _id: new mongodb_1.ObjectId(categoryId) });
        res.status(200).json({
            message: 'Categorycode deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting Category:', error);
        res.status(500).json({ message: 'Failed to delete Category', error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCategory = async (req, res) => {
    try {
        {
            const news = await database_services_1.default.categorys.find({});
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message });
    }
};
exports.getAllCategory = getAllCategory;
const getOneCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        {
            const news = await database_services_1.default.categorys.find({ _id: categoryId });
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message });
    }
};
exports.getOneCategory = getOneCategory;
const getNameById = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { categorIdId } = req.params;
        const data = await database_services_1.default.categorys.findById({ _id: categorIdId }).select('-image');
        res.status(201).json(data?.name);
    }
    catch (error) {
        console.error('Error get data:', error);
        res.status(500).json({ message: 'Failed to data', error: error.message });
    }
};
exports.getNameById = getNameById;
