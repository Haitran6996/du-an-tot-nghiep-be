"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const usersRoutes = (0, express_1.Router)();
usersRoutes.get('/', users_controllers_1.getAllUsers);
// usersRoutes.get('/:productId', getOneUsers)
usersRoutes.post('/', users_controllers_1.signUp);
usersRoutes.delete('/:userId', users_controllers_1.deleteUsers);
exports.default = usersRoutes;
