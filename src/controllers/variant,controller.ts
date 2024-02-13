// variantController.ts
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import databaseService from '../services/database.services'
import { addVariantValue, removeVariantValue, getAllVariants } from '../services/variant.services'

export const createVariant = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const variant = await addVariantValue(req.body._id, req.body.field, req.body.value)
    res.status(201).json(variant)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
export const removeVariant = async (req: Request, res: Response) => {
  try {
    const { variantId, elementId } = req.params
    const result = await removeVariantValue(variantId, elementId)
    if (!result) {
      return res.status(404).send('Element not found or could not be removed.')
    }
    res.send(result)
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}
export const getAllVariant = async (req: Request, res: Response) => {
  try {
    const result = await getAllVariants()

    res.status(201).json(result)
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}

export const updateVariant = async (req: Request, res: Response) => {
  const { nameId, variantId } = req.params
  const { elementId, newValue } = req.body // elementId là ID của phần tử cần cập nhật, newValue là giá trị mới

  // Kiểm tra tính hợp lệ của ID
  if (!mongoose.Types.ObjectId.isValid(variantId) || !mongoose.Types.ObjectId.isValid(elementId)) {
    return res.status(404).send('Invalid ID')
  }

  // Kiểm tra tính hợp lệ của tên mảng
  const validNames = ['ram', 'rom', 'color']
  if (!validNames.includes(nameId)) {
    return res.status(400).send('Invalid array name')
  }

  try {
    const updateQuery: any = {}
    updateQuery[`${nameId}.$.value`] = newValue

    const updateResult = await databaseService.variants.updateOne(
      { _id: new ObjectId(variantId), [`${nameId}.id`]: new ObjectId(elementId) },
      { $set: updateQuery }
    )

    if (updateResult.modifiedCount === 0) {
      return res.status(404).send('No element found with that id')
    }

    res.status(200).send('Updated successfully')
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
