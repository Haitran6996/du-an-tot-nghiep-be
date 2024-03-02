import { Router } from 'express'
import { addOrder, updateOrder, getById, getAll } from '../controllers/order.controllers'

const OrderRouters = Router()

OrderRouters.post('/', addOrder)
OrderRouters.get('/', getAll)
OrderRouters.get('/:userId', getById)
OrderRouters.patch('/:orderId/status', updateOrder)

export default OrderRouters
