/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express'

import databaseService from '../services/database.services'
export const getRevenue = async (req: Request, res: Response, next: NextFunction) => {
  let { period, date, week, month, year, startDate, endDate }: any = req.query

  try {
    let start, end

    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Đảm bảo kết thúc vào cuối ngày của endDate
    } else {
      year = parseInt(year, 10)
      month = parseInt(month, 10)

      switch (period) {
        case 'day':
          start = new Date(date)
          end = new Date(start)
          end.setDate(start.getDate() + 1)
          break
        case 'week':
          // Logic xử lý cho tuần cụ thể
          break
        case 'month':
          if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).json({ message: 'Year and month must be valid numbers' })
          }
          start = new Date(year, month - 1, 1)
          end = new Date(year, month, 0)
          end.setDate(end.getDate() + 1)
          break
        case 'year':
          if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Year must be a valid number' })
          }
          start = new Date(year, 0, 1)
          end = new Date(year + 1, 0, 1)
          break
        default:
          return res.status(400).json({ message: 'Invalid period specified or missing startDate/endDate' })
      }
    }

    if (start && end && (isNaN(start.getTime()) || isNaN(end.getTime()))) {
      return res.status(400).json({ message: 'Invalid start date or end date' })
    }

    const stats = await databaseService.orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: ['completed', 'pending', 'check', 'paid', 'shipped', 'cancelled'] }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$totalAmount' },
          totalCount: { $sum: 1 },
          // Thêm đếm tổng số hóa đơn theo từng trạng thái
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          checkCount: {
            $sum: { $cond: [{ $eq: ['$status', 'check'] }, 1, 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          shippedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalCount: 1,
          pendingCount: 1,
          checkCount: 1,
          paidCount: 1,
          completedCount: 1,
          shippedCount: 1,
          cancelledCount: 1
        }
      }
    ])

    const topProducts = await databaseService.products.aggregate([
      { $sort: { purchases: -1 } },
      { $limit: 10 },
      { $project: { description: 0 } }
    ])

    res.json({ stats, topProducts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getRevenueYear = async (req: Request, res: Response, next: NextFunction) => {
  let { year }: any = req.query

  try {
    // Chuyển đổi year sang số.
    year = parseInt(year, 10)

    if (!year || isNaN(year)) {
      return res.status(400).json({ message: 'Year must be a valid number' })
    }

    // Thiết lập ngày bắt đầu và kết thúc cho cả năm.
    const start = new Date(year, 0, 1) // Đầu năm
    const end = new Date(year + 1, 0, 1) // Đầu năm tiếp theo, không bao gồm trong khoảng thời gian

    const stats = await databaseService.orders.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: ['completed', 'pending', 'check', 'paid', 'shipped', 'cancelled'] }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalIncome: { $sum: '$totalAmount' },
          totalCount: { $sum: 1 },
          // Thêm đếm tổng số hóa đơn theo từng trạng thái
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          checkCount: {
            $sum: { $cond: [{ $eq: ['$status', 'check'] }, 1, 0] }
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          shippedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          totalIncome: 1,
          totalCount: 1,
          pendingCount: 1,
          checkCount: 1,
          paidCount: 1,
          completedCount: 1,
          shippedCount: 1,
          cancelledCount: 1
        }
      }
    ])

    const topProducts = await databaseService.products.aggregate([
      { $sort: { purchases: -1 } },
      { $limit: 10 },
      { $project: { description: 0 } }
    ])

    res.json({ stats, topProducts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
