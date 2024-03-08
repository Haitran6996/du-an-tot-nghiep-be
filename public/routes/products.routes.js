"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controllers_1 = require("../controllers/products.controllers");
const productsRoutes = (0, express_1.Router)();
productsRoutes.get('/pagination/:n/:p', products_controllers_1.paginationProduct);
productsRoutes.get('/', products_controllers_1.getAllProducts);
productsRoutes.get('/:productId', products_controllers_1.getProductById);
productsRoutes.patch('/:productId', products_controllers_1.updateProduct);
productsRoutes.post('/', products_controllers_1.addProducts);
productsRoutes.get('/sosanh/:id1/:id2', products_controllers_1.soSanh);
productsRoutes.get('/addview/:productId', products_controllers_1.addViewProductById);
productsRoutes.post('/filter/category', products_controllers_1.filterWithCategory); //body truyền lên categoryId, sort
productsRoutes.post('/filter', products_controllers_1.filterPriceNoneCategory); //body truyền lên start, end ,sort
productsRoutes.post('/filter/price/category', products_controllers_1.filterPriceWithCategory); //body truyền lên categoryId, start, end ,sort
productsRoutes.delete('/:productId', products_controllers_1.deleteProducts);
productsRoutes.delete('/:productId/options/:optionId', products_controllers_1.deleteOptions);
productsRoutes.post('/:productId/options', products_controllers_1.addProductsVariant);
productsRoutes.get('/rate/:productId', products_controllers_1.updateRating);
exports.default = productsRoutes;
