"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneSlider = exports.getAllSlider = exports.deleteSlider = exports.updateSlider = exports.addSlider = exports.paginationSlider = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationSlider = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 10;
            const p = 1;
        }
        const data = await database_services_1.default.slider.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.slider.aggregate([
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
exports.paginationSlider = paginationSlider;
const addSlider = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { productId, content, image } = req.body; // Mảng options rỗng
        const sliderInsertion = await database_services_1.default.slider.create({
            productId, content, image
        });
        res.status(201).json({
            message: 'slidercode created successfully',
            sliderId: sliderInsertion
        });
    }
    catch (error) {
        console.error('Error create slider:', error);
        res.status(500).json({ message: 'Failed to create slider', error: error.message });
    }
};
exports.addSlider = addSlider;
const updateSlider = async (req, res) => {
    const { sliderId } = req.params;
    const { productId, content, image } = req.body;
    try {
        const updateResult = await database_services_1.default.slider.findByIdAndUpdate({ _id: sliderId }, {
            productId: productId,
            content: content,
            image: image,
        });
        res.status(200).json({ message: 'Cập nhật slider thành công' });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật slidercode:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật slidercode' });
    }
};
exports.updateSlider = updateSlider;
const deleteSlider = async (req, res, next) => {
    const { sliderId } = req.params;
    try {
        await database_services_1.default.slider.deleteOne({ _id: new mongodb_1.ObjectId(sliderId) });
        res.status(200).json({
            message: 'slidercode deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting slider:', error);
        res.status(500).json({ message: 'Failed to delete slider', error: error.message });
    }
};
exports.deleteSlider = deleteSlider;
const getAllSlider = async (req, res) => {
    try {
        {
            const news = await database_services_1.default.slider.find({});
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all slider', error: error.message });
    }
};
exports.getAllSlider = getAllSlider;
const getOneSlider = async (req, res) => {
    try {
        const { sliderId } = req.params;
        {
            const news = await database_services_1.default.slider.find({ _id: sliderId });
            res.status(200).json(news);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get all slider', error: error.message });
    }
};
exports.getOneSlider = getOneSlider;
