"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentWithProduct = exports.getAllComment = exports.deleteCommentUser = exports.addComment = exports.paginationComment = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationComment = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p, productId } = req.params;
        if (n == null || p == null) {
            const n = 8;
            const py = 1;
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
const addComment = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, productId, comment } = req.body; // Mảng options rỗng
        // check user
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId, role: role });
        // check product
        const checkExistProduct = await database_services_1.default.users.find({ _id: productId });
        if (checkRoleUser[0]._id == userId && checkExistProduct) {
            const commentInsertion = await database_services_1.default.comments.create({
                userId,
                productId,
                comment
            });
            res.status(201).json({
                message: 'new created successfully',
                commentId: commentInsertion
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
    const { commentId, userId, role } = req.body;
    try {
        const checkCommentId = await database_services_1.default.comments.find({ _id: commentId });
        const checkRoleUser = await database_services_1.default.users.find({ _id: userId });
        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role) {
            await database_services_1.default.comments.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
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
const getCommentWithProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const comments = await database_services_1.default.comments.find({ productId: productId });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get news', error: error.message });
    }
};
exports.getCommentWithProduct = getCommentWithProduct;
