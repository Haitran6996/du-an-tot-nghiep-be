"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controllers_1 = require("~/controllers/products.controllers");
const productsRoutes = (0, express_1.Router)();
// productsRoutes.get('/', getAllProducts)
productsRoutes.post('/', products_controllers_1.addProducts);
productsRoutes.delete('/:productId', products_controllers_1.deleteProducts);
productsRoutes.delete('/:productId/options/:optionId', products_controllers_1.deleteOptions);
productsRoutes.post('/:productId/options', products_controllers_1.addProductsVariant);
exports.default = productsRoutes;
