import { Router } from 'express'
import {
  addProducts,
  addProductsVariant,
  deleteProducts,
  deleteOptions,
  getAllProducts,
  getProductById,
  updateProduct,
  paginationProduct
} from '../controllers/products.controllers'

const productsRoutes = Router()
productsRoutes.get('/pagination/:n/:p', paginationProduct)
productsRoutes.get('/', getAllProducts)
productsRoutes.get('/:productId', getProductById)
productsRoutes.patch('/:productId', updateProduct)
productsRoutes.post('/', addProducts)
productsRoutes.delete('/:productId', deleteProducts)
productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
productsRoutes.post('/:productId/options', addProductsVariant)

export default productsRoutes
