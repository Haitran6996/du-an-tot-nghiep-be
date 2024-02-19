"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../../controllers/auth/auth.controllers");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/login', auth_controllers_1.login);
authRoutes.post('/register', auth_controllers_1.register);
// authRoutes.put('/refresh', refreshToken)
exports.default = authRoutes;
