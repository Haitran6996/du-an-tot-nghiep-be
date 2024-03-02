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
        let cart = await Cart_model_1.default.findOne({ userId });
        if (cart) {
            const existingItemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId && item.options.includes(options));
            if (existingItemIndex !== -1) {
                const existingItem = cart.items[existingItemIndex];
                if (existingItem.quantity !== undefined) {
                    existingItem.quantity += quantity;
                }
                else {
                    existingItem.quantity = quantity;
                }
            }
            else {
                cart.items.push({ product: productId, options, quantity });
            }
            await cart.save();
        }
        else {
            const newCart = new Cart_model_1.default({
                userId,
                items: [{ product: productId, options, quantity }]
            });
            cart = await newCart.save();
        }
        res.json(cart); // Chỉ gửi phản hồi ở đây, sau khi đã xử lý toàn bộ logic
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
        const itemIndex = cart.items.findIndex((item) => item._id.toString() === productId);
        if (itemIndex > -1) {
            // Cập nhật số lượng sản phẩm
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            return cart; // Sử dụng return ở đây
        }
        else {
            return res.status(404).send('Item not found in cart');
        }
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}
exports.updateCartServices = updateCartServices;
async function placeOrder(userId, items) {
    await Cart_model_1.default.findOneAndDelete({ userId });
}
async function deleteItemCartServices(req, res) {
    try {
        const { userId, productId } = req.body;
        // Tìm giỏ hàng của người dùng
        let cart = await Cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        // Kiểm tra sản phẩm có trong giỏ hàng không
        const itemIndex = cart.items.findIndex((item) => item?._id.toString() === productId);
        if (itemIndex > -1) {
            // Xóa sản phẩm khỏi giỏ hàng
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.json(cart);
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
        const cart = await Cart_model_1.default.findOne({ userId }).populate({
            path: 'items.product',
            populate: {
                path: 'options', // Populate nested options của product
                model: 'options' // Đảm bảo tên mô hình là đúng
            }
        });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        let totalAmount = 0;
        // Lặp qua từng sản phẩm trong giỏ hàng và tính tổng tiền
        cart.items.forEach((item) => {
            const productPrice = item?.product?.price; // Giá của sản phẩm
            const quantity = item?.quantity; // Số lượng sản phẩm
            totalAmount += productPrice * quantity; // Tính tổng tiền cho sản phẩm này
        });
        return res.json({ cart, totalAmount }); // Trả về giỏ hàng và tổng tiền
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to get cart', error: error.message });
    }
}
exports.getCartServices = getCartServices;
