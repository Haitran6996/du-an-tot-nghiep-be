"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueYear = exports.getRevenue = void 0;
const database_services_1 = __importDefault(require("../services/database.services"));
const getRevenue = async (req, res, next) => {
    let { period, date, week, month, year, startDate, endDate } = req.query;
    try {
        let start, end;
        if (startDate && endDate) {
            // Nếu startDate và endDate được cung cấp, sử dụng chúng để xác định khoảng thời gian
            start = new Date(startDate);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Đảm bảo kết thúc vào cuối ngày của endDate
        }
        else {
            // Nếu không, xử lý dựa trên period
            year = parseInt(year, 10);
            month = parseInt(month, 10);
            switch (period) {
                case 'day':
                    start = new Date(date);
                    end = new Date(start);
                    end.setDate(start.getDate() + 1);
                    break;
                case 'week':
                    // Logic xử lý cho tuần cụ thể
                    break;
                case 'month':
                    if (!year || !month || isNaN(year) || isNaN(month)) {
                        return res.status(400).json({ message: 'Year and month must be valid numbers' });
                    }
                    start = new Date(year, month - 1, 1); // Tháng trong JS đếm từ 0
                    end = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng
                    end.setDate(end.getDate() + 1); // Đảm bảo endDate nằm ngoài khoảng thời gian
                    break;
                case 'year':
                    if (!year || isNaN(year)) {
                        return res.status(400).json({ message: 'Year must be a valid number' });
                    }
                    start = new Date(year, 0, 1);
                    end = new Date(year + 1, 0, 1); // Đảm bảo endDate nằm ngoài khoảng thời gian
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid period specified or missing startDate/endDate' });
            }
        }
        // Kiểm tra startDate và endDate có hợp lệ không
        if (start && end && (isNaN(start.getTime()) || isNaN(end.getTime()))) {
            return res.status(400).json({ message: 'Invalid start date or end date' });
        }
        const stats = await database_services_1.default.orders.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lt: end },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$totalAmount' }
                }
            }
        ]);
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getRevenue = getRevenue;
const getRevenueYear = async (req, res, next) => {
    let { year } = req.query;
    try {
        // Chuyển đổi year sang số.
        year = parseInt(year, 10);
        if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Year must be a valid number' });
        }
        // Thiết lập ngày bắt đầu và kết thúc cho cả năm.
        const start = new Date(year, 0, 1); // Đầu năm
        const end = new Date(year + 1, 0, 1); // Đầu năm tiếp theo, không bao gồm trong khoảng thời gian
        const stats = await database_services_1.default.orders.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lt: end },
                    status: 'completed' // Chỉ tính những đơn hàng đã hoàn thành
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' }, // Nhóm theo tháng của createdAt
                    totalIncome: { $sum: '$totalAmount' } // Tính tổng totalAmount cho mỗi nhóm
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp kết quả theo tháng, từ tháng 1 đến tháng 12
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    totalIncome: 1
                }
            }
        ]);
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getRevenueYear = getRevenueYear;
