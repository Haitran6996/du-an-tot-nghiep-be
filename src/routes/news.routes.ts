import { Router } from 'express'
import {
  addNews,
  deleteNews,
  updateNews,
  getAllNews,
  getNewById,
  paginationNews
} from '../controllers/news.controller'


const NewsRoutes = Router()

NewsRoutes.get('/pagination/:n/:p', paginationNews)
NewsRoutes.get('/:newId', getNewById)
NewsRoutes.post('/', addNews)
NewsRoutes.put('/:newId', updateNews)
NewsRoutes.delete('/:newId', deleteNews)

export default NewsRoutes
