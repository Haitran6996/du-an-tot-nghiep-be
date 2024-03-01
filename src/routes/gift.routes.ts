import { Router } from 'express'
import {
  addGift,
  deleteGift,
  updateGift,
  paginationGift,
  getGiftWithCode
} from '../controllers/gift.controllers'


const NewsRoutes = Router()

NewsRoutes.get('/pagination/:n/:p', paginationGift)
NewsRoutes.get('/:code', getGiftWithCode)
NewsRoutes.post('/', addGift)
NewsRoutes.put('/:giftId', updateGift)
NewsRoutes.delete('/', deleteGift)

export default NewsRoutes
