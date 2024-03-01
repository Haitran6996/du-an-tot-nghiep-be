"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.addOrder = void 0;
const database_services_1 = __importDefault(require("../services/database.services"));
const Order_model_1 = __importDefault(require("src/models/Order.model"));
const addOrder = async (req, res, next) => {
    try {
        // Giả sử req.body.userId là ID của người dùng đang đặt hàng
        const cart = await database_services_1.default.carts
            .findOne({ userId: req.body.userId })
            .populate('items.product')
            .populate('items.options');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        console.log(cart, 'cart');
        // Tạo ra một object đơn hàng từ giỏ hàng
        // Creating an order object from the cart
        const orderData = {
            userId: cart.userId,
            items: cart.items.map((item) => ({
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    date: item.product.date,
                    thumbnail: item.product.thumbnail,
                    price: item.product.price,
                    options: [...item.options]
                    // This should now be populated with option objects
                },
                quantity: item.quantity
            })),
            status: 'pending',
            totalAmount: cart.totalAmount
        };
        const newOrder = new Order_model_1.default(orderData);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
exports.addOrder = addOrder;
const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!['pending', 'paid', 'completed', 'shipped', 'cancelled'].includes(status)) {
            return res.status(400).send({ message: 'Invalid status value' });
        }
        const order = await database_services_1.default.orders.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.send(order);
    }
    catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.updateOrder = updateOrder;
