"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiftWithCode = exports.getAllGift = exports.deleteGift = exports.updateGift = exports.addGift = exports.paginationGift = void 0;
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
        const { code, sale, start, expire, content, limit } = req.body; // Mảng options rỗng
        // check user
        // const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // // check product
        // if (checkRoleUser[0]._id == userId && checkRoleUser[0]._id == 0) {
        const giftInsertion = await database_services_1.default.gifts.create({
            code,
            sale,
            start,
            expire,
            content,
            limit
        });
        res.status(201).json({
            message: 'Giftcode created successfully',
            giftId: giftInsertion
        });
        // }
    }
    catch (error) {
        console.error('Error create Gift:', error);
        res.status(500).json({ message: 'Failed to create Gift', error: error.message });
    }
};
exports.addGift = addGift;
const updateGift = async (req, res) => {
    const { giftId } = req.params;
    const { code, sale, start, expire, limit } = req.body;
    try {
        const updateResult = await database_services_1.default.gifts.findByIdAndUpdate({ _id: giftId }, {
            code: code,
            sale: sale,
            start: start,
            expire: expire,
            limit: limit
        });
        res.status(200).json({ message: 'Cập nhật Gift thành công' });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật Giftcode:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật Giftcode' });
    }
};
exports.updateGift = updateGift;
const deleteGift = async (req, res, next) => {
    const { giftId } = req.params;
    try {
        await database_services_1.default.comments.deleteOne({ _id: new mongodb_1.ObjectId(giftId) });
        res.status(200).json({
            message: 'Giftcode deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting Gift:', error);
        res.status(500).json({ message: 'Failed to delete Gift', error: error.message });
    }
};
exports.deleteGift = deleteGift;
const getAllGift = async (req, res) => {
    try {
        const news = await database_services_1.default.gifts.find({});
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all Gift', error: error.message });
    }
};
exports.getAllGift = getAllGift;
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
