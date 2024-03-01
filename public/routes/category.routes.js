"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controllers_1 = require("../controllers/category.controllers");
const categoryRoutes = (0, express_1.Router)();
categoryRoutes.post('/add', category_controllers_1.addCategory);
categoryRoutes.post('/update', category_controllers_1.updateCategory);
categoryRoutes.post('/delete', category_controllers_1.deleteCategory);
categoryRoutes.get('/', category_controllers_1.getAllCategory);
categoryRoutes.get('/pagination/:n/:p', category_controllers_1.paginationCategory);
// productsRoutes.delete('/:productId', deleteProducts)
// productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
// productsRoutes.post('/:productId/options', addProductsVariant)
exports.default = categoryRoutes;
