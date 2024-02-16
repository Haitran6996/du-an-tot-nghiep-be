import { Router } from 'express'
import {
  addNews,
  deleteNews,
  updateNews,
  getAllNews,
  getNewById
} from '../controllers/news.controller'


const NewsRoutes = Router()

NewsRoutes.get('/', getAllNews)
NewsRoutes.get('/:newId', getNewById)
NewsRoutes.post('/', addNews)
NewsRoutes.put('/:newId', updateNews)
NewsRoutes.delete('/:newId', deleteNews)

export default NewsRoutes
