"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// variantRouter.ts
const express_1 = __importDefault(require("express"));
const revenue_controllers_1 = require("../controllers/revenue.controllers");
const revenueRouters = express_1.default.Router();
// Route để tạo biến thể mới
revenueRouters.get('', revenue_controllers_1.getRevenue);
revenueRouters.get('/total-year', revenue_controllers_1.getRevenueYear);
// vnpayRouters.post('/vnpay_return', returnVnpay)
exports.default = revenueRouters;
