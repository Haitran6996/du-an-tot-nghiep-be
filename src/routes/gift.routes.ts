import { Router } from 'express'
import {
  addGift,
  deleteGift,
  updateGift,
  paginationGift,
  getAllGift,
  getGiftWithCode
} from '../controllers/gift.controllers'


const NewsRoutes = Router()

NewsRoutes.get('/pagination/:n/:p', paginationGift)
NewsRoutes.get('/:code', getGiftWithCode)
NewsRoutes.get('/', getAllGift)
NewsRoutes.post('/', addGift)
NewsRoutes.put('/:giftId', updateGift)
NewsRoutes.delete('/:giftId', deleteGift)

export default NewsRoutes
