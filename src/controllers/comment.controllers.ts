import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p, productId } = req.params
        if (n == null || p == null) {
          const n = 8
          const py = 1
        }
        const data = await databaseService.comments.aggregate([
          { $match: {productId:productId} },
          { $skip: (Number(p) * Number(n)) - Number(n) },
          { $limit: Number(n) }
        ])
        const total = await databaseService.comments.aggregate([
          { $match: {productId:productId} },
          { $count: "total" }
        ])
        const Total = total[0].total
        res.status(201).json({ data, p, n, Total })
      } catch (error: any) {
        console.error('Error get data:', error)
        res.status(500).json({ message: 'Failed to data', error: error.message })
      }
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, productId, comment } = req.body // Mảng options rỗng

        // check user
        const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // check product
        const checkExistProduct = await databaseService.users.find({ _id: productId })
        if (checkRoleUser[0]._id == userId && checkExistProduct) {
            const commentInsertion = await databaseService.comments.create({
                userId,
                productId,
                comment
            }
            )
            res.status(201).json({
                message: 'new created successfully',
                commentId: commentInsertion
            })
        }
    } catch (error: any) {
        console.error('Error comment:', error)
        res.status(500).json({ message: 'Failed to comment', error: error.message })
    }
}

export const deleteCommentUser = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, userId, role } = req.body

    try {
        const checkCommentId = await databaseService.comments.find({ _id: commentId })
        const checkRoleUser = await databaseService.users.find({ _id: userId })

        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role) {
            await databaseService.comments.deleteOne({ _id: new ObjectId(commentId) })

            res.status(200).json({
                message: 'new deleted successfully'
            })
        }
    } catch (error: any) {
        console.error('Error deleting comment:', error)
        res.status(500).json({ message: 'Failed to delete comment', error: error.message })
    }
}

export const getAllComment = async (req: Request, res: Response) => {
    const { userId, role } = req.params
    try {
        const checkAdmin = await databaseService.users.find({ _id: userId, role: role })
        if (checkAdmin[0].role == 0) {
            const news = await databaseService.comments.find({})
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all comments', error: error.message })
    }
}
export const getCommentWithProduct = async (req: Request, res: Response) => {
    const { productId } = req.params
    try {
        const comments = await databaseService.comments.find({ productId: productId })
        res.status(200).json(comments)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get news', error: error.message })
    }
}
