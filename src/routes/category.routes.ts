import { Router } from 'express'
import { addCategory, updateCategory, getAllCategory, deleteCategory, paginationCategory } from '../controllers/category.controllers'

const categoryRoutes = Router()

categoryRoutes.post('/add', addCategory)
categoryRoutes.post('/update', updateCategory)
categoryRoutes.post('/delete', deleteCategory)
categoryRoutes.get('/', getAllCategory)
categoryRoutes.get('/pagination/:n/:p', paginationCategory)
// productsRoutes.delete('/:productId', deleteProducts)
// productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
// productsRoutes.post('/:productId/options', addProductsVariant)

export default categoryRoutes