import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from 'src/services/database.services'

export const addNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { name, description, image, status_news } = req.body // Mảng options rỗng

    // Tạo sản phẩm mới với mảng options rỗng
    const newInsertion = await databaseService.news.create({
      name,
      description,
      image,
      status_news
    }
    )

    res.status(201).json({
      message: 'new created successfully',
      newId: newInsertion
    })
  } catch (error: any) {
    console.error('Error creating new:', error)
    res.status(500).json({ message: 'Failed to create new', error: error.message })
  }
}

export const updateNews = async (req: Request, res: Response) => {
  const { newId } = req.params
  const { name, image, description, status_news } = req.body

  try {

    const updateResult = await databaseService.news.findByIdAndUpdate(
      { _id: new ObjectId(newId) },
      {
        name: name,
        image: image,
        description: description,
        status_news: status_news
      }
    )
    res.status(200).send('Updated successfully')
  } catch (error: any) {
    res.status(400).json({ message: 'Error:' + error.message })
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
