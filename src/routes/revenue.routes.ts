// variantRouter.ts
import express from 'express'
import { getRevenue, getRevenueYear } from '../controllers/revenue.controllers'

const revenueRouters = express.Router()

// Route để tạo biến thể mới
revenueRouters.get('', getRevenue)
revenueRouters.get('/total-year', getRevenueYear)
// vnpayRouters.post('/vnpay_return', returnVnpay)

export default revenueRouters
