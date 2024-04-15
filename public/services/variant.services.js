"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVariants = exports.removeVariantValue = exports.addVariantValue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
async function addVariantValue(variantId, field, value) {
    // Tạo một đối tượng mới phù hợp với ArrayElementSchema
    const element = {
        id: new mongoose_1.default.Types.ObjectId(), // Mongoose tự động tạo nếu bạn không cung cấp
        value: value
    };
    console.log(variantId, 'variantId');
    const data = await database_services_1.default.variants.findOne({ _id: variantId });
    console.log(data, 'data');
    // Cập nhật sử dụng Mongoose
    const update = { $push: { [field]: element } };
    const variant = await database_services_1.default.variants.findOneAndUpdate({ _id: new mongodb_1.ObjectId(variantId) }, update, {
        returnDocument: 'after'
    });
    if (!variant) {
        throw new Error('Document not found or update failed');
    }
    return variant;
}
exports.addVariantValue = addVariantValue;
async function removeVariantValue(variantId, elementId) {
    const filter = { _id: new mongodb_1.ObjectId(variantId) };
    const update = {
        $pull: {
            ram: { id: new mongodb_1.ObjectId(elementId) }, // Giả sử bạn đang xóa từ mảng 'ram'
            rom: { id: new mongodb_1.ObjectId(elementId) }, // Lặp lại cho mỗi mảng nếu bạn không biết nó thuộc mảng nào
            color: { id: new mongodb_1.ObjectId(elementId) }, // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
            card: { id: new mongodb_1.ObjectId(elementId) }, // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
            chip: { id: new mongodb_1.ObjectId(elementId) } // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
        }
    };
    const result = await database_services_1.default.variants.updateOne(filter, update);
    if (!result) {
        throw new Error('No document found with the provided elementId or no update made.');
    }
    return result; // Trả về document sau khi cập nhật
}
exports.removeVariantValue = removeVariantValue;
async function getAllVariants() {
    const result = await database_services_1.default.variants.find({});
    console.log(result, 'resultresult');
    if (result.length === 0) {
        throw new Error('No document found with the provided elementId or no update made.');
    }
    return result;
}
exports.getAllVariants = getAllVariants;
