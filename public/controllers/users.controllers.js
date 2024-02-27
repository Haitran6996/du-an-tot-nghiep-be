"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.deleteUsers = exports.signUp = exports.getUsernameById = exports.paginationUsers = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("../services/database.services"));
const paginationUsers = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params;
        if (n == null || p == null) {
            const n = 15;
            const p = 1;
        }
        const data = await database_services_1.default.users.aggregate([
            { $match: { role: 1 } },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ]);
        const total = await database_services_1.default.users.aggregate([
            { $match: { role: 1 } },
            { $count: "total" }
        ]);
        const Total = total[0].total;
        res.status(201).json({ data, p, n, Total });
    }
    catch (error) {
        console.error('Error get data:', error);
        res.status(500).json({ message: 'Failed to data', error: error.message });
    }
};
exports.paginationUsers = paginationUsers;
const getUsernameById = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { userId } = req.params;
        const username = await database_services_1.default.users.findById({ userId }).select('+username -password -role -image -status -mail -refreshToken');
        res.status(201).json({ username });
    }
    catch (error) {
        console.error('Error get data:', error);
        res.status(500).json({ message: 'Failed to data', error: error.message });
    }
};
exports.getUsernameById = getUsernameById;
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
        const users = await database_services_1.default.users.find({}).select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const { _id } = req.params;
    try {
        const user = await database_services_1.default.users.find({ _id: _id }).select('-password -refreshToken');
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get data Users', error: error.message });
    }
};
exports.getUserById = getUserById;
