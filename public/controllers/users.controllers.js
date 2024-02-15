"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllUsers = exports.deleteUsers = exports.signUp = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const signUp = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { username, mail, password, role } = req.body;
        //Check tài khoản có trong db hay không
        const checkExist = await database_services_1.default.users.find({ username: username }).select('+username -password -role -image -status -mail');
        // Tạo tài khoản mới
        if (role != 0 && checkExist == null) {
            const usersInsertion = await database_services_1.default.users.create({
                username,
                mail,
                password,
                role
            });
            res.status(201).json({
                message: 'User created successfully',
                userId: usersInsertion._id
            });
        }
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};
exports.signUp = signUp;
const deleteUsers = async (req, res, next) => {
    const { userId } = req.params;
    try {
        await database_services_1.default.users.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
        res.status(200).json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};
exports.deleteUsers = deleteUsers;
const getAllUsers = async (req, res) => {
    try {
        const users = await database_services_1.default.products.find({}).select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const pipeline = [
            { $match: { _id: new mongodb_1.ObjectId(productId) } },
            {
                $lookup: {
                    from: 'options',
                    localField: 'options',
                    foreignField: '_id',
                    as: 'optionsDetails'
                }
            }
        ];
        const result = await database_services_1.default.products.aggregate(pipeline);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};
exports.getProductById = getProductById;