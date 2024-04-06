import { Router } from 'express'
import { getLogWithOrder } from '../controllers/log.controllers'


const LogRoutes = Router()

LogRoutes.get('/:orderId', getLogWithOrder)

export default LogRoutes