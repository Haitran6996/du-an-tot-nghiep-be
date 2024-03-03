import { Router } from 'express'
import { addCategory, updateCategory,getNameById,getOneCategory, getAllCategory, deleteCategory, paginationCategory } from '../controllers/category.controllers'

const categoryRoutes = Router()

categoryRoutes.post('/add', addCategory)
categoryRoutes.put('/:categoryId', updateCategory)
categoryRoutes.delete('/delete/:categoryId', deleteCategory)
categoryRoutes.get('/', getAllCategory)
categoryRoutes.get('/:categoryId', getOneCategory)
categoryRoutes.get('/name/:categoryId', getNameById)
categoryRoutes.get('/pagination/:n/:p', paginationCategory)


export default categoryRoutes