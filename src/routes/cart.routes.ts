import { Router } from 'express'
import { addToCart, updateCart, getCart, deleteItemCart } from '../controllers/cart.controllers'

const cartRoutes = Router()

cartRoutes.post('/add-to-cart', addToCart)
cartRoutes.post('/update-cart-item', updateCart)
cartRoutes.post('/delete-item', deleteItemCart)
cartRoutes.get('/:userId', getCart)
// productsRoutes.delete('/:productId', deleteProducts)
// productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
// productsRoutes.post('/:productId/options', addProductsVariant)

export default cartRoutes
