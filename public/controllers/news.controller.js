"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewById = exports.getAllNews = exports.deleteNews = exports.updateNews = exports.addNews = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const addNews = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { name, description, status_news } = req.body; // Mảng options rỗng
        // Tạo sản phẩm mới với mảng options rỗng
        const newInsertion = await database_services_1.default.news.create({
            name,
            description,
            status_news
        });
        res.status(201).json({
            message: 'new created successfully',
            newId: newInsertion._id
        });
    }
    catch (error) {
        console.error('Error creating new:', error);
        res.status(500).json({ message: 'Failed to create new', error: error.message });
    }
};
exports.addNews = addNews;
const updateNews = async (req, res) => {
    const { nameId, newId } = req.params;
    const { elementId, newValue } = req.body; // elementId là ID của phần tử cần cập nhật, newValue là giá trị mới
    // Kiểm tra tính hợp lệ của ID
    if (!mongoose_1.default.Types.ObjectId.isValid(newId) || !mongoose_1.default.Types.ObjectId.isValid(elementId)) {
        return res.status(404).send('Invalid ID');
    }
    const validNames = ['name', 'description', 'status_news'];
    if (!validNames.includes(nameId)) {
        return res.status(400).send('Invalid array name');
    }
    try {
        const updateQuery = {};
        updateQuery[`${nameId}.$.value`] = newValue;
        const updateResult = await database_services_1.default.news.updateOne({ _id: new mongodb_1.ObjectId(newId), [`${nameId}.id`]: new mongodb_1.ObjectId(elementId) }, { $set: updateQuery });
        if (updateResult.modifiedCount === 0) {
            return res.status(404).send('No element found with that id');
        }
        res.status(200).send('Updated successfully');
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res, next) => {
    const { newId } = req.params;
    try {
        await database_services_1.default.news.deleteOne({ _id: new mongodb_1.ObjectId(newId) });
        res.status(200).json({
            message: 'new deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting new:', error);
        res.status(500).json({ message: 'Failed to delete new', error: error.message });
    }
};
exports.deleteNews = deleteNews;
const getAllNews = async (req, res) => {
    try {
        const news = await database_services_1.default.news.find({});
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get news', error: error.message });
    }
};
exports.getAllNews = getAllNews;
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
