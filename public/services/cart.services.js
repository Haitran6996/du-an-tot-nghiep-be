"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartServices = exports.deleteItemCartServices = exports.updateCartServices = exports.addToCartServices = void 0;
const Cart_model_1 = __importDefault(require("../models/Cart.model"));
async function addToCartServices(req, res) {
    try {
        const { userId, productId, options, quantity } = req.body;
        // Tìm giỏ hàng của người dùng
        let cart = await Cart_model_1.default.findOne({ userId });
        if (cart) {
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
            if (itemIndex > -1) {
                // Sản phẩm đã tồn tại, cập nhật số lượng;la
                let item = cart.items[itemIndex];
                item.quantity += quantity;
                cart.items[itemIndex] = item;
            }
            else {
                // Thêm sản phẩm mới vào giỏ hàng
                cart.items.push({ product: productId, options, quantity });
            }
            await cart.save();
        }
        else {
            // Tạo giỏ hàng mới nếu người dùng chưa có giỏ hàng
            const newCart = new Cart_model_1.default({
                userId,
                items: [{ product: productId, options, quantity }]
            });
            await newCart.save();
            cart = newCart;
        }
        return cart;
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
exports.addToCartServices = addToCartServices;
async function updateCartServices(req, res) {
    try {
        const { userId, productId, quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).send('Quantity must be greater than 0');
        }
        // Tìm giỏ hàng của người dùng
        let cart = await Cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex > -1) {
            // Cập nhật số lượng sản phẩm
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            return cart;
        }
        else {
            res.status(404).send('Item not found in cart');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
exports.updateCartServices = updateCartServices;
async function deleteItemCartServices(req, res) {
    try {
        const { userId, productId } = req.body;
        // Tìm giỏ hàng của người dùng
        let cart = await Cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        // Kiểm tra sản phẩm có trong giỏ hàng không
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex > -1) {
            // Xóa sản phẩm khỏi giỏ hàng
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return cart;
        }
        else {
            res.status(404).send('Item not found in cart');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
exports.deleteItemCartServices = deleteItemCartServices;
async function getCartServices(req, res) {
    try {
        const userId = req.params.userId;
        const cart = await Cart_model_1.default.findOne({ userId }).populate('items.product').populate('items.options');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return cart;
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to get cart', error: error.message });
    }
}
exports.getCartServices = getCartServices;
