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
            const p = 1
        }
        const data = await databaseService.commentR.aggregate([
            { $match: { productId: productId } },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ])
        const total = await databaseService.commentR.aggregate([
            { $match: { productId: productId } },
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
        const checkExistProduct = await databaseService.products.find({ _id: productId })
        if (checkRoleUser[0]._id == userId && checkExistProduct) {
            const commentInsertion = await databaseService.commentR.create({
                userId,
                productId,
                comment
            }
            )
            res.status(201).json({
                message: 'new created successfully',
                commentRId: commentInsertion
            })
        }
    } catch (error: any) {
        console.error('Error comment:', error)
        res.status(500).json({ message: 'Failed to comment', error: error.message })
    }
}

export const deleteCommentUser = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params
    const { userId, role } = req.body

    try {
        const checkCommentId = await databaseService.commentR.find({ _id: commentId })
        const checkRoleUser = await databaseService.users.find({ _id: userId })

        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role && checkRoleUser[0].role == 0) {
            await databaseService.commentR.deleteOne({ _id: new ObjectId(commentId) })

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
    try {
        const news = await databaseService.commentR.find({})
        res.status(200).json(news)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all commentR', error: error.message })
    }
}
export const getCommentWithProduct = async (req: Request, res: Response) => {
    const { productId } = req.params
    try {
        const commentR = await databaseService.commentR.find({ productId: productId }).populate('userId', 'username')
        res.status(200).json(commentR)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get news', error: error.message })
    }
}

//reply

export const addReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, productId, commentRId, comment } = req.body // Mảng options rỗng

        // check user
        const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // check product
        const checkExistProduct = await databaseService.products.find({ _id: productId })
        const checkExistCommentR = await databaseService.commentR.find({ _id: commentRId })

        if (checkRoleUser[0]._id == userId && checkExistProduct != null && checkExistCommentR != null) {
            const commentInsertion = await databaseService.reply.create({
                userId,
                productId,
                commentRId,
                comment
            }
            )

            res.status(201).json({
                message: 'new created successfully',
                replyId: commentInsertion
            })
            await databaseService.commentR.findByIdAndUpdate(commentRId, { reply: checkExistCommentR[0].reply + 1 })
        }
    } catch (error: any) {
        console.error('Error comment:', error)
        res.status(500).json({ message: 'Failed to comment', error: error.message })
    }
}

export const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
    const { commentRId, replyId } = req.params
    const { userId, role } = req.body

    try {
        const checkCommentId = await databaseService.reply.find({ _id: replyId, commentRId: commentRId })
        const checkRoleUser = await databaseService.users.find({ _id: userId })

        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role && checkRoleUser[0].role == 0) {
            await databaseService.reply.deleteOne({ _id: new ObjectId(replyId) })

            res.status(200).json({
                message: 'new deleted successfully'
            })
        }
    } catch (error: any) {
        console.error('Error deleting comment:', error)
        res.status(500).json({ message: 'Failed to delete comment', error: error.message })
    }
}

export const getAllReply = async (req: Request, res: Response) => {
    try {
        const news = await databaseService.reply.find({})
        res.status(200).json(news)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all commentR', error: error.message })
    }
}
export const getReplyWithProductAndComment = async (req: Request, res: Response) => {
    const { productId, commentRId } = req.params
    try {
        const commentR = await databaseService.reply.find({ productId: productId, commentRId: commentRId }).populate('userId', 'username')
        res.status(200).json(commentR)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get news', error: error.message })
    }
}
