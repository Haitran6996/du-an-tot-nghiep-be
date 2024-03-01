"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.deleteItemCart = exports.updateCart = exports.addToCart = void 0;
const cart_services_1 = require("../services/cart.services");
const addToCart = async (req, res) => {
    try {
        const data = await (0, cart_services_1.addToCartServices)(req, res);
        return data;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addToCart = addToCart;
const updateCart = async (req, res) => {
    try {
        const data = await (0, cart_services_1.updateCartServices)(req, res);
        return data;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateCart = updateCart;
const deleteItemCart = async (req, res) => {
    try {
        const data = await (0, cart_services_1.deleteItemCartServices)(req, res);
        return data;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteItemCart = deleteItemCart;
const getCart = async (req, res) => {
    try {
        const data = await (0, cart_services_1.getCartServices)(req, res);
        return data;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getCart = getCart;
