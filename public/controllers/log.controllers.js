"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogWithOrder = exports.getAllLog = exports.addLog = exports.paginationComment = void 0;
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationComment = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p, productId } = req.params;
        if (n == null || p == null) {
            const n = 8;
            const p = 1;
        }
        const data = await database_services_1.default.comments.aggregate([
            { $match: { productId: productId } },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.comments.aggregate([
            { $match: { productId: productId } },
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
exports.paginationComment = paginationComment;
const addLog = async (userId, role, orderId, oldStatus, newStatus, priceOrder, note) => {
    try {
        // Kết nối tới database nếu cần
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        const checkExistOrder = await database_services_1.default.orders.find({ _id: orderId });
        if (checkRoleUser[0]._id == userId && checkRoleUser[0].role == role && checkExistOrder[0] != null) {
            const commentInsertion = await database_services_1.default.log.create({
                userId: userId,
                role: role,
                orderId: orderId,
                oldStatus: oldStatus,
                newStatus: newStatus,
                priceOrder: priceOrder,
                note: note
            });
            commentInsertion;
        }
    }
    catch (error) {
        console.error('Error comment:', error);
    }
};
exports.addLog = addLog;
const getAllLog = async (req, res) => {
    try {
        const news = await database_services_1.default.log.find({}).populate('userId', 'username').sort({ createdAt: 'desc' });
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get log', error: error.message });
    }
};
exports.getAllLog = getAllLog;
const getLogWithOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const comments = await database_services_1.default.log.find({ orderId: orderId }).populate('userId', 'username').sort({ createdAt: 'desc' });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get log', error: error.message });
    }
};
exports.getLogWithOrder = getLogWithOrder;
