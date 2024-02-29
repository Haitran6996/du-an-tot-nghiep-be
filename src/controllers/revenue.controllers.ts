/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express'

import databaseService from '../services/database.services'

export const getRevenue = async (req: Request, res: Response, next: NextFunction) => {
  let { period, date, week, month, year, startDate, endDate }: any = req.query

  try {
    let start, end

    if (startDate && endDate) {
      // Nếu startDate và endDate được cung cấp, sử dụng chúng để xác định khoảng thời gian
      start = new Date(startDate)
      end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Đảm bảo kết thúc vào cuối ngày của endDate
    } else {
      // Nếu không, xử lý dựa trên period
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
          start = new Date(year, month - 1, 1) // Tháng trong JS đếm từ 0
          end = new Date(year, month, 0) // Lấy ngày cuối cùng của tháng
          end.setDate(end.getDate() + 1) // Đảm bảo endDate nằm ngoài khoảng thời gian
          break
        case 'year':
          if (!year || isNaN(year)) {
            return res.status(400).json({ message: 'Year must be a valid number' })
          }
          start = new Date(year, 0, 1)
          end = new Date(year + 1, 0, 1) // Đảm bảo endDate nằm ngoài khoảng thời gian
          break
        default:
          return res.status(400).json({ message: 'Invalid period specified or missing startDate/endDate' })
      }
    }

    // Kiểm tra startDate và endDate có hợp lệ không
    if (start && end && (isNaN(start.getTime()) || isNaN(end.getTime()))) {
      return res.status(400).json({ message: 'Invalid start date or end date' })
    }

    const stats = await databaseService.orders.aggregate([
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
    ])

    res.json(stats)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
