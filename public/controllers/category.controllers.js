"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategory = exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.paginationCategory = void 0;
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
        const { userId, role, name, image } = req.body; // Mảng options rỗng
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        if (checkRoleUser[0]._id == userId && checkRoleUser[0]._id == 0) {
            const CategoryInsertion = await database_services_1.default.categorys.create({
                name,
                image
            });
            res.status(201).json({
                message: 'Categorycode created successfully',
                CategoryId: CategoryInsertion
            });
        }
    }
    catch (error) {
        console.error('Error create Category:', error);
        res.status(500).json({ message: 'Failed to create Category', error: error.message });
    }
};
exports.addCategory = addCategory;
const updateCategory = async (req, res) => {
    try {
        const { CategoryId } = req.params;
        const updateData = req.body; // Dữ liệu cập nhật được gửi từ client
        // Tìm sản phẩm để cập nhật
        const Category = await database_services_1.default.categorys.findById(CategoryId);
        if (!Category) {
            return res.status(404).json({ message: 'Categorycode không tồn tại' });
        }
        // Cập nhật chỉ các thuộc tính được gửi từ client
        Object.keys(updateData).forEach((key) => {
            Category[key] = updateData[key];
        });
        // Lưu sản phẩm đã cập nhật
        await Category.save();
        // Trả về thông tin sản phẩm đã cập nhật
        res.json({ message: 'Cập nhật Categorycode thành công', Category });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật Categorycode:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật Categorycode' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    const { CategoryId, userId, role } = req.body;
    try {
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId });
        if (Number(role) == checkRoleUser[0].role && Number(role) == 0) {
            await database_services_1.default.categorys.deleteOne({ _id: new mongodb_1.ObjectId(CategoryId) });
            res.status(200).json({
                message: 'Categorycode deleted successfully'
            });
        }
    }
    catch (error) {
        console.error('Error deleting Category:', error);
        res.status(500).json({ message: 'Failed to delete Category', error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCategory = async (req, res) => {
    const { userId, role } = req.params;
    try {
        const checkAdmin = await database_services_1.default.users.find({ _id: userId, role: role });
        if (checkAdmin[0].role == 0) {
            const news = await database_services_1.default.categorys.find({});
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message });
    }
};
exports.getAllCategory = getAllCategory;
