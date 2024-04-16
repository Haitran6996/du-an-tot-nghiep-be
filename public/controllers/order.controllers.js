"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getById = exports.updateOrder = exports.addOrder = exports.getOne = void 0;
const database_services_1 = __importDefault(require("../services/database.services"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const Cart_model_1 = __importDefault(require("../models/Cart.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_controllers_1 = require("./log.controllers");
async function placeOrder(userId, items) {
    await Cart_model_1.default.findOneAndDelete({ userId });
}
async function getOne(req, res, next) {
    const { id } = req.params;
    try {
        // Kiểm tra xem ID có phải là một ObjectId hợp lệ của MongoDB không
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }
        // Tìm đơn hàng theo ID và populate thông tin liên quan nếu cần
        const order = await database_services_1.default.orders
            .findById(id)
            .populate('user_cancel_order')
            .populate('userId', 'name email -_id')
            .sort({ createdAt: -1 })
            .populate({
            path: 'items._id',
            populate: {
                path: 'options', // Populate nested options của product
                model: 'options' // Đảm bảo tên mô hình là đúng
            }
        }); // Sắp xếp từ mới nhất đến cũ nhất
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
}
exports.getOne = getOne;
const addOrder = async (req, res, next) => {
    const { userId, role, orderId } = req.body;
    const newStatus = req.body.status;
    try {
        const cart = await database_services_1.default.carts.findOne({ userId: req.body.userId }).populate({
            path: 'items.product',
            populate: {
                path: 'options',
                model: 'options' // Đảm bảo tên mô hình là đúng
            }
        });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        let totalAmount = 0;
        const itemsWithUpdatedPrice = cart.items.map((item) => {
            // Tính giá dựa trên option được chọn
            let itemTotalPrice = 0;
            item.product.options.forEach((option) => {
                if (item.options.includes(option._id.toString())) {
                    itemTotalPrice = option.price * item.quantity;
                }
            });
            totalAmount += itemTotalPrice; // Cập nhật tổng tiền cho đơn hàng
            // Trả về item mới với giá đã được cập nhật
            return {
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    date: item.product.date,
                    thumbnail: item.product.thumbnail,
                    price: itemTotalPrice, // Cập nhật giá dựa trên option được chọn
                    options: [...item.options]
                },
                quantity: item.quantity
            };
        });
        const orderData = {
            userId: cart.userId,
            items: itemsWithUpdatedPrice,
            status: req.body.status,
            totalAmount: totalAmount,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address
        };
        const newOrder = new Order_model_1.default(orderData);
        const savedOrder = await newOrder.save();
        if (savedOrder) {
            await placeOrder(req.body.userId, cart.items);
            res.status(201).json(savedOrder);
            (0, log_controllers_1.addLog)(userId, role, orderId, 'none', newStatus, totalAmount, '');
        }
    }
    catch (err) {
        console.log(err, 'errr');
        res.status(500).json(err);
    }
};
exports.addOrder = addOrder;
const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        if (req.body.status === 'cancelled' && req.body.desc === '' && !req.body.user_cancel_order) {
            return res.status(404).send({ message: 'truyền thiếu trường!, kiểm tra lại thông tin' });
        }
        const { status, userId, role, oldStatus } = req.body;
        const newStatus = req.body.status;
        if (!['pending', 'paid', 'completed', 'shipped', 'cancelled'].includes(status)) {
            return res.status(400).send({ message: 'Invalid status value' });
        }
        const getOd = await database_services_1.default.orders.findById(orderId);
        const totalAmount = getOd?.totalAmount;
        const order = await database_services_1.default.orders.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        // Nếu đơn hàng được cập nhật thành completed, cập nhật trường purchases cho từng sản phẩm
        if (status === 'completed') {
            await Promise.all(order.items.map(async (item) => {
                const productId = item.product._id;
                // Tăng trường purchases lên 1
                await database_services_1.default.products.findByIdAndUpdate(productId, { $inc: { purchases: 1 } });
            }));
        }
        res.send(order);
        if (req.body.status === 'cancelled') {
            const note = req.body.note;
            (0, log_controllers_1.addLog)(userId, role, orderId, oldStatus, newStatus, totalAmount, note);
        }
        else {
            (0, log_controllers_1.addLog)(userId, role, orderId, oldStatus, newStatus, totalAmount, '');
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.updateOrder = updateOrder;
const getById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await database_services_1.default.orders.findOne({ userId: userId }).sort({ createdAt: -1 });
        // .populate({
        //   path: 'items._id',
        //   populate: {
        //     path: 'options', // Populate nested options của product
        //     model: 'options'
        //     // Đảm bảo tên mô hình là đúng
        //   }
        // }) // Sắp xếp từ mới nhất đến cũ nhất
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
exports.getById = getById;
const getAll = async (req, res, next) => {
    try {
        const orders = await database_services_1.default.orders
            .find({})
            .sort({ createdAt: -1 })
            .populate('user_cancel_order')
            .populate('userId')
            .populate({
            path: 'items.product',
            populate: {
                path: 'options', // Populate nested options của product
                model: 'options' // Đảm bảo tên mô hình là đúng
            }
        }); // Sắp xếp từ mới nhất đến cũ nhất
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
exports.getAll = getAll;
