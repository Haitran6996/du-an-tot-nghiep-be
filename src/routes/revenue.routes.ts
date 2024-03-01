// variantRouter.ts
import express from 'express'
import { getRevenue } from '../controllers/revenue.controllers'

const revenueRouters = express.Router()

// Route để tạo biến thể mới
revenueRouters.get('', getRevenue)
// vnpayRouters.post('/vnpay_return', returnVnpay)

export default revenueRouters
