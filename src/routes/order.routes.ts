import { Router } from 'express'
import { addOrder, updateOrder, getById, getAll, getOne } from '../controllers/order.controllers'

const OrderRouters = Router()

OrderRouters.post('/', addOrder)
OrderRouters.get('/', getAll)
OrderRouters.get('/:id', getOne)
OrderRouters.get('/user/:userId', getById)
OrderRouters.patch('/:orderId/status', updateOrder)

export default OrderRouters
