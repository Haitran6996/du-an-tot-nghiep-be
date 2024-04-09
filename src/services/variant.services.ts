import mongoose from 'mongoose'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

export async function addVariantValue(variantId: string, field: string, value: string) {
  // Tạo một đối tượng mới phù hợp với ArrayElementSchema
  const element = {
    id: new mongoose.Types.ObjectId(), // Mongoose tự động tạo nếu bạn không cung cấp
    value: value
  }

  console.log(variantId, 'variantId')

  const data = await databaseService.variants.findOne({ _id: variantId })

  console.log(data, 'data')

  // Cập nhật sử dụng Mongoose
  const update: any = { $push: { [field]: element } }

  const variant = await databaseService.variants.findOneAndUpdate({ _id: new ObjectId(variantId) }, update, {
    returnDocument: 'after'
  })

  if (!variant) {
    throw new Error('Document not found or update failed')
  }

  return variant
}

export async function removeVariantValue(variantId: string, elementId: string) {
  const filter = { _id: new ObjectId(variantId) }
  const update = {
    $pull: {
      ram: { id: new ObjectId(elementId) }, // Giả sử bạn đang xóa từ mảng 'ram'
      rom: { id: new ObjectId(elementId) }, // Lặp lại cho mỗi mảng nếu bạn không biết nó thuộc mảng nào
      color: { id: new ObjectId(elementId) }, // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
      card: { id: new ObjectId(elementId) }, // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
      chip: { id: new ObjectId(elementId) } // Điều này sẽ kiểm tra và xóa elementId từ tất cả mảng
    }
  }

  const result = await databaseService.variants.updateOne(filter, update)
  if (!result) {
    throw new Error('No document found with the provided elementId or no update made.')
  }

  return result // Trả về document sau khi cập nhật
}

export async function getAllVariants() {
  const result = await databaseService.variants.find({})
  console.log(result, 'resultresult')
  if (result.length === 0) {
    throw new Error('No document found with the provided elementId or no update made.')
  }
  return result
}
