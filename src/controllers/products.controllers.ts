import { Request, Response, NextFunction, Router } from 'express'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const addProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { name, description } = req.body

    // Tạo sản phẩm mới với mảng options rỗng
    const productInsertion = await databaseService.products.insertOne({
      name,
      description,
      options: [] // Mảng options rỗng
    })

    res.status(201).json({
      message: 'Product created successfully',
      productId: productInsertion.insertedId
    })
  } catch (error: any) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Failed to create product', error: error.message })
  }
}

export const addProductsVariant = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params
  const optionData = req.body

  try {
    const optionInsertion = await databaseService.options.insertOne(optionData)
    const optionId = optionInsertion.insertedId

    await databaseService.products.updateOne(
      { _id: new ObjectId(productId) },
      { $push: { options: new ObjectId(optionId) } }
    )

    res.status(201).json({
      message: 'Option created and added to product successfully',
      optionId: optionId
    })
  } catch (error: any) {
    console.error('Error adding option to product:', error)
    res.status(500).json({ message: 'Failed to add option to product', error: error.message })
  }
}

export const deleteProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params

  try {
    await databaseService.products.deleteOne({ _id: new ObjectId(productId) })

    res.status(200).json({
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Failed to delete product', error: error.message })
  }
}

export const deleteOptions = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, optionId } = req.params

  try {
    await databaseService.products.updateOne(
      { _id: new ObjectId(productId) },
      { $pull: { options: new ObjectId(optionId) } } // Sử dụng $pull để loại bỏ optionId khỏi mảng options
    )

    // Tùy chọn: Xóa option khỏi collection options nếu không còn được tham chiếu
    await databaseService.options.deleteOne({ _id: new ObjectId(optionId) })

    res.status(200).json({
      message: 'Option removed from product successfully'
    })
  } catch (error: any) {
    console.error('Error removing option from product:', error)
    res.status(500).json({ message: 'Failed to remove option from product', error: error.message })
  }
}
