import { Router } from 'express'
import { addProducts, addProductsVariant, deleteProducts, deleteOptions } from '~/controllers/products.controllers'

const productsRoutes = Router()

// productsRoutes.get('/', getAllProducts)
productsRoutes.post('/', addProducts)
productsRoutes.delete('/:productId', deleteProducts)
productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
productsRoutes.post('/:productId/options', addProductsVariant)

export default productsRoutes
