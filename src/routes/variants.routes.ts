// variantRouter.ts
import express from 'express'
import { createVariant, removeVariant, getAllVariant, updateVariant } from 'src/controllers/variant,controller'

const variantRoutes = express.Router()

// Route để tạo biến thể mới
variantRoutes.post('/', createVariant)

variantRoutes.get('/', getAllVariant)
variantRoutes.put('/:nameId/:variantId', updateVariant)
variantRoutes.delete('/:variantId/:elementId', removeVariant)

export default variantRoutes
