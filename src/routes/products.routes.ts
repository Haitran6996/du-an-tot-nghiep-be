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
  filterPriceWithCategory,
  filterPriceNoneCategory,
  filterWithCategory,
  addViewProductById,
  updateRating
} from '../controllers/products.controllers'

const productsRoutes = Router()
productsRoutes.get('/pagination/:n/:p', paginationProduct)
productsRoutes.get('/', getAllProducts)
productsRoutes.get('/:productId', getProductById)
productsRoutes.patch('/:productId', updateProduct)
productsRoutes.post('/', addProducts)
productsRoutes.get('/sosanh/:id1/:id2', soSanh)
productsRoutes.get('/sosanh/:id1/:id2/:id3', soSanh)
productsRoutes.get('/addview/:productId', addViewProductById)
productsRoutes.post('/filter/category', filterWithCategory) //body truyền lên categoryId, sort
productsRoutes.post('/filter', filterPriceNoneCategory) //body truyền lên start, end ,sort
productsRoutes.post('/filter/price/category', filterPriceWithCategory) //body truyền lên categoryId, start, end ,sort
productsRoutes.delete('/:productId', deleteProducts)
productsRoutes.delete('/:productId/options/:optionId', deleteOptions)
productsRoutes.post('/:productId/options', addProductsVariant)
productsRoutes.get('/rate/:productId',updateRating)

export default productsRoutes
