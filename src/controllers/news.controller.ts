import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const addNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { name, description, status_news } = req.body // Mảng options rỗng

    // Tạo sản phẩm mới với mảng options rỗng
    const newInsertion = await databaseService.news.create({
      name,
      description,
      status_news
    })

    res.status(201).json({
      message: 'new created successfully',
      newId: newInsertion._id
    })
  } catch (error: any) {
    console.error('Error creating new:', error)
    res.status(500).json({ message: 'Failed to create new', error: error.message })
  }
}

export const updateNews = async (req: Request, res: Response) => {
    const { nameId, newId } = req.params
    const { elementId, newValue } = req.body // elementId là ID của phần tử cần cập nhật, newValue là giá trị mới
  
    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(newId) || !mongoose.Types.ObjectId.isValid(elementId)) {
      return res.status(404).send('Invalid ID')
    }
  
    const validNames = ['name', 'description', 'status_news']
    if (!validNames.includes(nameId)) {
      return res.status(400).send('Invalid array name')
    }
  
    try {
      const updateQuery: any = {}
      updateQuery[`${nameId}.$.value`] = newValue
  
      const updateResult = await databaseService.news.updateOne(
        { _id: new ObjectId(newId), [`${nameId}.id`]: new ObjectId(elementId) },
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

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  const { newId } = req.params

  try {
    await databaseService.news.deleteOne({ _id: new ObjectId(newId) })

    res.status(200).json({
      message: 'new deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting new:', error)
    res.status(500).json({ message: 'Failed to delete new', error: error.message })
  }
}

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await databaseService.news.find({})
    res.status(200).json(news)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get news', error: error.message })
  }
}
export const getNewById = async (req: Request, res: Response) => {
  const { newId } = req.params
  try {
    const pipeline = [
      { $match: { _id: new ObjectId(newId) } },
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'optionsDetails'
        }
      }
    ]

    const result = await databaseService.news.aggregate(pipeline)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get news', error: error.message })
  }
}
