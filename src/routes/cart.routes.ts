import { Router } from 'express'
import { addToCart, updateCart } from 'src/controllers/cart.controllers'

const cartRoutes = Router()

cartRoutes.post('/add-to-cart', addToCart)
cartRoutes.post('/update-cart-item', updateCart)
// productsRoutes.delete('/:productId', deleteProducts)
// productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
// productsRoutes.post('/:productId/options', addProductsVariant)

export default cartRoutes
