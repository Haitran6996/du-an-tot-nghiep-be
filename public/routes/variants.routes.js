"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// variantRouter.ts
const express_1 = __importDefault(require("express"));
const variant_controller_1 = require("src/controllers/variant,controller");
const variantRoutes = express_1.default.Router();
// Route để tạo biến thể mới
variantRoutes.post('/', variant_controller_1.createVariant);
variantRoutes.get('/', variant_controller_1.getAllVariant);
variantRoutes.put('/:nameId/:variantId', variant_controller_1.updateVariant);
variantRoutes.delete('/:variantId/:elementId', variant_controller_1.removeVariant);
exports.default = variantRoutes;
