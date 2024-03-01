"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controllers_1 = require("../controllers/order.controllers");
const OrderRouters = (0, express_1.Router)();
OrderRouters.post('/', order_controllers_1.addOrder);
OrderRouters.patch('/:orderId/status', order_controllers_1.updateOrder);
exports.default = OrderRouters;
