import { NextFunction, Request, Response, Router } from 'express'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'
import categoryRoutes from 'src/routes/category.routes'
Router({ mergeParams: true })

export const paginationProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { n, p } = req.params
    if (n == null || p == null) {
      const n = 24
      const p = 1
    }
    const data = await databaseService.products.aggregate([
      { $match: {} },
      { $skip: Number(p) * Number(n) - Number(n) },
      { $limit: Number(n) }
    ])
    const total = await databaseService.products.aggregate([{ $match: {} }, { $count: 'total' }])
    const Total = total[0].total
    res.status(201).json({ data, p, n, Total })
  } catch (error: any) {
    console.error('Error get data:', error)
    res.status(500).json({ message: 'Failed to data', error: error.message })
  }
}

export const filterPriceWithCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categorId, start, end, sort } = req.body
    const data = await databaseService.products.aggregate([
      {
        $match: {
          "categoryId": categorId,
          "price": { "$lte": end, "$gte": start }
        }
      },
      {
        $sort: { "price": sort }
      }
    ])
    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error get product:', error)
    res.status(500).json({ message: 'Failed to get product', error: error.message })
  }
}
export const filterWithCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, sort } = req.body
    const data = await databaseService.products.aggregate([
      {
        $match: {
          "categoryId": categoryId,
        }
      },
      {
        $sort: { "price": sort }
      }
    ])
    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error get product:', error)
    res.status(500).json({ message: 'Failed to get product', error: error.message })
  }
}
export const filterPriceNoneCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start, end, sort } = req.body
    const data = await databaseService.products.aggregate([
      {
        $match: {
          "price": { "$lte": end, "$gte": start }
        }
      },
      {
        $sort: { "price": sort }
      }
    ])
    res.status(201).json(data)
  } catch (error: any) {
    console.error('Error get product:', error)
    res.status(500).json({ message: 'Failed to get product', error: error.message })
  }
}

export const addProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { name, categoryId, description, price, date, thumbnail } = req.body

    // Tạo sản phẩm mới với mảng options rỗng
    const productInsertion = await databaseService.products.create({
      name,
      categoryId,
      description,
      price,
      date,
      thumbnail,
      options: [] // Mảng options rỗng
    })

    res.status(201).json({
      message: 'Product created successfully',
      productId: productInsertion._id
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
    const optionInsertion = await databaseService.options.create(optionData)
    const optionId = optionInsertion._id

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
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { name, sort } = req.query

    let query = {}
    if (name) {
      query = {
        ...query,
        name: { $regex: new RegExp(name.toString(), 'i') }
      }
    }

    let products
    if (sort === 'purchases') {
      // Sắp xếp theo số lượng mua giảm dần và giới hạn số lượng sản phẩm trả về
      products = await databaseService.products.find(query).sort({ purchases: -1 }) // Sắp xếp theo số lượng mua giảm dần
    } else {
      products = await databaseService.products.find(query)
    }

    res.status(200).json(products)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get products', error: error.message })
  }
}
export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params
  try {
    const pipeline = [
      { $match: { _id: new ObjectId(productId) } },
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'optionsDetails'
        }
      }
    ]

    const result = await databaseService.products.aggregate(pipeline)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get products', error: error.message })
  }
}

export const soSanh = async (req: Request, res: Response) => {
  const array: any = []
  if (req.params.id1 && req.params.id2) {
    array.push(req.params.id1)
    array.push(req.params.id2)
  }
  if (req.params.id3) {
    array.push(req.params.id3)
  }
  try {
    const data: any = []
    for (let index = 0; index < array.length; index++) {
      const product: any = await databaseService.products.findById(array[index])
      data.push(product)
    }
    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get products', error: error.message })
  }
}
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId
    console.log(req.params.id, 'req.params.id')
    const updateData = req.body // Dữ liệu cập nhật được gửi từ client

    // Tìm sản phẩm để cập nhật
    const product: any = await databaseService.products.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    // Cập nhật chỉ các thuộc tính được gửi từ client
    Object.keys(updateData).forEach((key: any) => {
      product[key] = updateData[key]
    })

    // Lưu sản phẩm đã cập nhật
    await product.save()

    // Trả về thông tin sản phẩm đã cập nhật
    res.json({ message: 'Cập nhật sản phẩm thành công', product })
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm' })
  }
}
