"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.updatePass = exports.updateAvatar = exports.getAllUsers = exports.deleteUsers = exports.signUp = exports.getUsernameById = exports.paginationUsers = void 0;
const md5_1 = __importDefault(require("md5"));
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
        const data = await database_services_1.default.users.findById({ _id: userId }).select('-__v -_id -password -role -image -status -mail -refreshToken');
        res.status(201).json(data?.username);
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
    const { userId } = req.body;
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
const updateAvatar = async (req, res, next) => {
    const { userId, role, avatar, Token } = req.body;
    try {
        const checkExist = await database_services_1.default.users.find({ _id: userId, role: role, refreshToken: Token }).select('+username -password -role -image -status -mail');
        // Tạo tài khoản mới
        if (checkExist == null) {
            res.status(500).json({
                message: 'Không tìm thấy user'
            });
        }
        {
            await database_services_1.default.users.findByIdAndUpdate({ _id: userId }, {
                image: avatar
            });
            res.status(200).json({
                message: 'Cập nhật ảnh đại diện thành công'
            });
        }
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};
exports.updateAvatar = updateAvatar;
const updatePass = async (req, res, next) => {
    const { userId, role, Token } = req.body;
    const passOld = (0, md5_1.default)(req.body.passwordOld);
    const passNew = (0, md5_1.default)(req.body.passwordNew);
    try {
        const checkExist = await database_services_1.default.users.find({ _id: userId, role: role, password: passOld, refreshToken: Token }).select(' -role -image -status -mail -refreshToken');
        // Tạo tài khoản mới
        if (checkExist == null) {
            res.status(500).json({
                message: 'Không tìm thấy user'
            });
        }
        {
            await database_services_1.default.users.findByIdAndUpdate({ _id: userId }, {
                password: passNew
            });
            res.status(200).json({
                message: 'Cập nhật mật khẩu thành công'
            });
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed:', error: error.message });
    }
};
exports.updatePass = updatePass;
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
