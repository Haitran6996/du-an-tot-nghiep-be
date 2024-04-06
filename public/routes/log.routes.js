"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_controllers_1 = require("../controllers/log.controllers");
const LogRoutes = (0, express_1.Router)();
LogRoutes.get('/:orderId', log_controllers_1.getLogWithOrder);
exports.default = LogRoutes;
