import { Router } from 'express'
import { getLogWithOrder, getAllLog } from '../controllers/log.controllers'
const LogRoutes = Router()

LogRoutes.get('/:orderId', getLogWithOrder)
LogRoutes.get('/', getAllLog)

export default LogRoutes