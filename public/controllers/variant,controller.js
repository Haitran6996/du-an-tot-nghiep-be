"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVariant = exports.getAllVariant = exports.removeVariant = exports.createVariant = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const database_services_1 = __importDefault(require("~/services/database.services"));
const variant_services_1 = require("~/services/variant.services");
const createVariant = async (req, res) => {
    console.log(req.body);
    try {
        const variant = await (0, variant_services_1.addVariantValue)(req.body._id, req.body.field, req.body.value);
        res.status(201).json(variant);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createVariant = createVariant;
const removeVariant = async (req, res) => {
    try {
        const { variantId, elementId } = req.params;
        const result = await (0, variant_services_1.removeVariantValue)(variantId, elementId);
        if (!result) {
            return res.status(404).send('Element not found or could not be removed.');
        }
        res.send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.removeVariant = removeVariant;
const getAllVariant = async (req, res) => {
    try {
        const result = await (0, variant_services_1.getAllVariants)();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.getAllVariant = getAllVariant;
const updateVariant = async (req, res) => {
    const { nameId, variantId } = req.params;
    const { elementId, newValue } = req.body; // elementId là ID của phần tử cần cập nhật, newValue là giá trị mới
    // Kiểm tra tính hợp lệ của ID
    if (!mongoose_1.default.Types.ObjectId.isValid(variantId) || !mongoose_1.default.Types.ObjectId.isValid(elementId)) {
        return res.status(404).send('Invalid ID');
    }
    // Kiểm tra tính hợp lệ của tên mảng
    const validNames = ['ram', 'rom', 'color'];
    if (!validNames.includes(nameId)) {
        return res.status(400).send('Invalid array name');
    }
    try {
        const updateQuery = {};
        updateQuery[`${nameId}.$.value`] = newValue;
        const updateResult = await database_services_1.default.variants.updateOne({ _id: new mongodb_1.ObjectId(variantId), [`${nameId}.id`]: new mongodb_1.ObjectId(elementId) }, { $set: updateQuery });
        if (updateResult.modifiedCount === 0) {
            return res.status(404).send('No element found with that id');
        }
        res.status(200).send('Updated successfully');
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateVariant = updateVariant;
