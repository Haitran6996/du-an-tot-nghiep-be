"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    thumbnail: { type: String, required: true },
    purchases: { type: Number, default: 0 },
    price: { type: Number, required: true },
    view: { type: Number, default: 0, require: false },
    rating: {
        type: Number, default: 5, enum: {
            values: [1, 2, 3, 4, 5],
            message: '{VALUE} không được phép'
        }
    },
    options: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'options' }]
});
exports.default = mongoose_1.default.model('product', ProductSchema);
