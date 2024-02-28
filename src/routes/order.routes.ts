import { Router } from 'express'
import { addOrder, updateOrder } from '../controllers/order.controllers'

const OrderRouters = Router()

OrderRouters.post('/', addOrder)
OrderRouters.patch('/:orderId/status', updateOrder)

export default OrderRouters
