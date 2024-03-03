import { Router } from 'express'
import {
  addProducts,
  addProductsVariant,
  deleteProducts,
  deleteOptions,
  getAllProducts,
  getProductById,
  updateProduct,
  paginationProduct,
  soSanh,
  filterPrice,
  filterPriceNCategory
} from '../controllers/products.controllers'

const productsRoutes = Router()
productsRoutes.get('/pagination/:n/:p', paginationProduct)
productsRoutes.get('/', getAllProducts)
productsRoutes.get('/:productId', getProductById)
productsRoutes.patch('/:productId', updateProduct)
productsRoutes.post('/', addProducts)
productsRoutes.get('/sosanh/:id1/:id2', soSanh)
productsRoutes.post('/filter/category', filterPrice)
productsRoutes.post('/filter', filterPriceNCategory)
productsRoutes.delete('/:productId', deleteProducts)
productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
productsRoutes.post('/:productId/options', addProductsVariant)

export default productsRoutes
