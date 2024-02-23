"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewById = exports.getAllNews = exports.deleteNews = exports.updateNews = exports.addNews = exports.paginationNews = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationNews = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 12;
            const p = 1;
        }
        const data = await database_services_1.default.news.aggregate([
            { $match: {} },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.news.aggregate([
            { $match: {} },
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
exports.paginationNews = paginationNews;
const addNews = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { title, imageUrl, shortContent, content, statusNews } = req.body; // Mảng options rỗng
        // Tạo sản phẩm mới với mảng options rỗng
        const newInsertion = await database_services_1.default.news.create({
            title,
            imageUrl,
            shortContent,
            content,
            statusNews
        });
        res.status(201).json({
            message: 'new created successfully',
            newId: newInsertion
        });
    }
    catch (error) {
        console.error('Error creating new:', error);
        res.status(500).json({ message: 'Failed to create new', error: error.message });
    }
};
exports.addNews = addNews;
const updateNews = async (req, res) => {
    const { newId } = req.params;
    const { title, imageUrl, shortContent, content, statusNews } = req.body;
    try {
        const updateResult = await database_services_1.default.news.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(newId) }, {
            title: title,
            imageUrl: imageUrl,
            content: content,
            shortContent: shortContent,
            statusNews: statusNews
        });
        res.status(200).send('Updated successfully');
    }
    catch (error) {
        res.status(400).json({ message: 'Error:' + error.message });
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
