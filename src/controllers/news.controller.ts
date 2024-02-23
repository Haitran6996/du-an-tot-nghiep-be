import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { n, p } = req.params
    if (n == null || p == null) {
      const n = 12
      const p = 1
    }
    const data = await databaseService.news.aggregate([
      { $match: {} },
      { $skip: (Number(p) * Number(n)) - Number(n) },
      { $limit: Number(n) }
    ])
    const total = await databaseService.news.aggregate([
      { $match: {} },
      { $count: "total" }
    ])
    const Total = total[0].total
    res.status(201).json({ data, p, n, Total })
  } catch (error: any) {
    console.error('Error get data:', error)
    res.status(500).json({ message: 'Failed to data', error: error.message })
  }
}

export const addNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { title, imageUrl, shortContent, content, statusNews } = req.body // Mảng options rỗng

    // Tạo sản phẩm mới với mảng options rỗng
    const newInsertion = await databaseService.news.create({
      title,
      imageUrl,
      shortContent,
      content,
      statusNews
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
  const { title, imageUrl, shortContent, content, statusNews } = req.body

  try {

    const updateResult = await databaseService.news.findByIdAndUpdate(
      { _id: new ObjectId(newId) },
      {
        title: title,
        imageUrl: imageUrl,
        content: content,
        shortContent: shortContent,
        statusNews: statusNews
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
