"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiftWithCode = exports.getAllComment = exports.deleteGift = exports.updateGift = exports.addGift = exports.paginationGift = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationGift = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 10;
            const p = 1;
        }
        const data = await database_services_1.default.comments.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.comments.aggregate([
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
exports.paginationGift = paginationGift;
const addGift = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, code, sale, start, expire, content } = req.body; // Mảng options rỗng
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        if (checkRoleUser[0]._id == userId && checkRoleUser[0]._id == 0) {
            const giftInsertion = await database_services_1.default.gifts.create({
                code,
                sale,
                start,
                expire,
                content
            });
            res.status(201).json({
                message: 'Giftcode created successfully',
                giftId: giftInsertion
            });
        }
    }
    catch (error) {
        console.error('Error create Gift:', error);
        res.status(500).json({ message: 'Failed to create Gift', error: error.message });
    }
};
exports.addGift = addGift;
const updateGift = async (req, res) => {
    try {
        const { giftId } = req.params;
        const updateData = req.body; // Dữ liệu cập nhật được gửi từ client
        // Tìm sản phẩm để cập nhật
        const gift = await database_services_1.default.gifts.findById(giftId);
        if (!gift) {
            return res.status(404).json({ message: 'Giftcode không tồn tại' });
        }
        // Cập nhật chỉ các thuộc tính được gửi từ client
        Object.keys(updateData).forEach((key) => {
            gift[key] = updateData[key];
        });
        // Lưu sản phẩm đã cập nhật
        await gift.save();
        // Trả về thông tin sản phẩm đã cập nhật
        res.json({ message: 'Cập nhật giftcode thành công', gift });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật giftcode:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật giftcode' });
    }
};
exports.updateGift = updateGift;
const deleteGift = async (req, res, next) => {
    const { giftId, userId, role } = req.body;
    try {
        const checkCommentId = await database_services_1.default.comments.find({ _id: giftId });
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId });
        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role) {
            await database_services_1.default.comments.deleteOne({ _id: new mongodb_1.ObjectId(giftId) });
            res.status(200).json({
                message: 'Giftcode deleted successfully'
            });
        }
    }
    catch (error) {
        console.error('Error deleting Gift:', error);
        res.status(500).json({ message: 'Failed to delete Gift', error: error.message });
    }
};
exports.deleteGift = deleteGift;
const getAllComment = async (req, res) => {
    const { userId, role } = req.params;
    try {
        const checkAdmin = await database_services_1.default.users.find({ _id: userId, role: role });
        if (checkAdmin[0].role == 0) {
            const news = await database_services_1.default.comments.find({});
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all comments', error: error.message });
    }
};
exports.getAllComment = getAllComment;
const getGiftWithCode = async (req, res) => {
    const { code } = req.params;
    try {
        const gift = await database_services_1.default.gifts.find({ code: code });
        res.status(200).json(gift);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get:', error: error.message });
    }
};
exports.getGiftWithCode = getGiftWithCode;
