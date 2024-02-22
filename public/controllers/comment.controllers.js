"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewById = exports.getAllComment = exports.deleteCommentUser = exports.addComment = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
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
    const { commentId, userId, role } = req.params;
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
    const { productId } = req.params;
    try {
        const comments = await database_services_1.default.comments.find({ productId: productId });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all comments', error: error.message });
    }
};
exports.getAllComment = getAllComment;
const getNewById = async (req, res) => {
    const { newId } = req.params;
    try {
        const pipeline = [
            { $match: { _id: new mongodb_1.ObjectId(newId) } },
            {
                $lookup: {
                    from: 'options',
                    localField: 'options',
                    foreignField: '_id',
                    as: 'optionsDetails'
                }
            }
        ];
        const result = await database_services_1.default.news.aggregate(pipeline);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get news', error: error.message });
    }
};
exports.getNewById = getNewById;
