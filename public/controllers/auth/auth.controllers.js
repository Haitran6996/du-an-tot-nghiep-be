"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getToken = exports.refreshToken = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("src/services/database.services"));
const hash = 8;
const register = async (req, res, next) => {
    try {
        // Kết nối tới database nếu cần
        const { username, mail, password, role } = req.body;
        const hashPassword = (0, md5_1.default)(password);
        //Check tài khoản có trong db hay không
        const checkExistUsername = await database_services_1.default.users.findOne({ username: username });
        if (checkExistUsername) {
            return res.status(401).json('Tên đăng nhập đã được sử dụng.');
        }
        const checkExistMail = await database_services_1.default.users.findOne({ mail: mail });
        if (checkExistMail) {
            return res.status(401).json('Mail đã được sử dụng.');
        }
        // Tạo tài khoản mới
        if (role != 0) {
            const usersInsertion = await database_services_1.default.users.create({
                username,
                mail,
                password: hashPassword,
                role
            });
            res.status(201).json({
                message: 'Register successfully',
                userId: usersInsertion._id
            });
        }
        else if (role == 0) {
            res.status(401).json('Create failed');
        }
    }
    catch (error) {
        console.error('Error register:', error);
        res.status(500).json({ message: 'Failed to register', error: error.message });
    }
};
exports.register = register;
const refreshToken = async (req, res, next) => {
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
exports.refreshToken = refreshToken;
const getToken = async (req, res) => {
    try {
        const { username, } = req.body;
        const token = await database_services_1.default.users.find({}).select('-password');
        res.status(200).json(token);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};
exports.getToken = getToken;
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // get data
        const user = await database_services_1.default.users.find({ username }).select('-mail ');
        if (!user) {
            return res.status(401).json('Tên đăng nhập không chính xác.');
        }
        // check password
        const hashPassword = (0, md5_1.default)(password);
        if (hashPassword != user[0].password) {
            return res.status(401).json(' mật khẩu không chính xác.');
        }
        const userDelPass = await database_services_1.default.users.find({ username }).select('-password');
        return res.json({
            msg: 'Đăng nhập thành công.',
            userDelPass
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
};
exports.login = login;
