// variantRouter.ts
import express from 'express'
import { createVnpay } from '../controllers/vnpay.controllers'

const vnpayRouters = express.Router()

// Route để tạo biến thể mới
vnpayRouters.post('/', createVnpay)
// vnpayRouters.post('/vnpay_return', returnVnpay)

export default vnpayRouters
