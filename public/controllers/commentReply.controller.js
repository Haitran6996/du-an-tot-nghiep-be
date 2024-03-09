"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReplyWithProductAndComment = exports.getAllReply = exports.deleteReply = exports.addReply = exports.getCommentWithProduct = exports.getAllComment = exports.deleteCommentUser = exports.addComment = exports.paginationComment = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationComment = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p, productId } = req.params;
        if (n == null || p == null) {
            const n = 8;
            const p = 1;
        }
        const data = await database_services_1.default.commentR.aggregate([
            { $match: { productId: productId } },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.commentR.aggregate([
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
const addComment = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, productId, comment } = req.body; // Mảng options rỗng
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        const checkExistProduct = await database_services_1.default.products.find({ _id: productId });
        if (checkRoleUser[0]._id == userId && checkExistProduct) {
            const commentInsertion = await database_services_1.default.commentR.create({
                userId,
                productId,
                comment
            });
            res.status(201).json({
                message: 'new created successfully',
                commentRId: commentInsertion
            });
        }
    }
    catch (error) {
        console.error('Error comment:', error);
        res.status(500).json({ message: 'Failed to comment', error: error.message });
    }
};
exports.addComment = addComment;
const deleteCommentUser = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId, role } = req.body;
    try {
        const checkCommentId = await database_services_1.default.commentR.find({ _id: commentId });
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId });
        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role && checkRoleUser[0].role == 0) {
            await database_services_1.default.commentR.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
            res.status(200).json({
                message: 'new deleted successfully'
            });
        }
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
};
exports.deleteCommentUser = deleteCommentUser;
const getAllComment = async (req, res) => {
    try {
        const news = await database_services_1.default.commentR.find({});
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all commentR', error: error.message });
    }
};
exports.getAllComment = getAllComment;
const getCommentWithProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const commentR = await database_services_1.default.commentR.find({ productId: productId }).populate('userId', 'username');
        res.status(200).json(commentR);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get news', error: error.message });
    }
};
exports.getCommentWithProduct = getCommentWithProduct;
//reply
const addReply = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, productId, commentRId, comment } = req.body; // Mảng options rỗng
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        const checkExistProduct = await database_services_1.default.products.find({ _id: productId });
        const checkExistCommentR = await database_services_1.default.commentR.find({ _id: commentRId });
        if (checkRoleUser[0]._id == userId && checkExistProduct != null && checkExistCommentR != null) {
            const commentInsertion = await database_services_1.default.reply.create({
                userId,
                productId,
                commentRId,
                comment
            });
            res.status(201).json({
                message: 'new created successfully',
                replyId: commentInsertion
            });
            await database_services_1.default.commentR.findByIdAndUpdate(commentRId, { reply: checkExistCommentR[0].reply + 1 });
        }
    }
    catch (error) {
        console.error('Error comment:', error);
        res.status(500).json({ message: 'Failed to comment', error: error.message });
    }
};
exports.addReply = addReply;
const deleteReply = async (req, res, next) => {
    const { commentRId, replyId } = req.params;
    const { userId, role } = req.body;
    try {
        const checkCommentId = await database_services_1.default.reply.find({ _id: replyId, commentRId: commentRId });
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId });
        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role && checkRoleUser[0].role == 0) {
            await database_services_1.default.reply.deleteOne({ _id: new mongodb_1.ObjectId(replyId) });
            res.status(200).json({
                message: 'new deleted successfully'
            });
        }
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
};
exports.deleteReply = deleteReply;
const getAllReply = async (req, res) => {
    try {
        const news = await database_services_1.default.reply.find({});
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all commentR', error: error.message });
    }
};
exports.getAllReply = getAllReply;
const getReplyWithProductAndComment = async (req, res) => {
    const { productId, commentRId } = req.params;
    try {
        const commentR = await database_services_1.default.reply.find({ productId: productId, commentRId: commentRId }).populate('userId', 'username');
        res.status(200).json(commentR);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get news', error: error.message });
    }
};
exports.getReplyWithProductAndComment = getReplyWithProductAndComment;
