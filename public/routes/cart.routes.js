"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controllers_1 = require("src/controllers/cart.controllers");
const cartRoutes = (0, express_1.Router)();
cartRoutes.post('/add-to-cart', cart_controllers_1.addToCart);
cartRoutes.post('/update-cart-item', cart_controllers_1.updateCart);
// productsRoutes.delete('/:productId', deleteProducts)
// productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
// productsRoutes.post('/:productId/options', addProductsVariant)
exports.default = cartRoutes;
