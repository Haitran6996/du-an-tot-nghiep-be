"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// variantRouter.ts
const express_1 = __importDefault(require("express"));
const vnpay_controllers_1 = require("../controllers/vnpay.controllers");
const vnpayRouters = express_1.default.Router();
// Route để tạo biến thể mới
vnpayRouters.post('', vnpay_controllers_1.createVnpay);
// vnpayRouters.post('/vnpay_return', returnVnpay)
exports.default = vnpayRouters;
