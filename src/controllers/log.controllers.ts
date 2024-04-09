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
        const data = await databaseService.comments.aggregate([
            { $match: { productId: productId } },
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ])
        const total = await databaseService.comments.aggregate([
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

export const addLog = async (userId: any, role: any, orderId: any, oldStatus: any, newStatus: any, priceOrder: any) => {
    try {
        // Kết nối tới database nếu cần

        // check user
        const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // check product
        const checkExistOrder = await databaseService.orders.find({ _id: orderId })
        if (checkRoleUser[0]._id == userId && checkRoleUser[0].role == role && checkExistOrder[0] != null) {
            const commentInsertion = await databaseService.log.create({
                userId: userId,
                role: role,
                orderId: orderId,
                oldStatus: oldStatus,
                newStatus: newStatus,
                priceOrder: priceOrder,
            }
            )
            commentInsertion
        }
    } catch (error: any) {
        console.error('Error comment:', error)
    }
}
export const getAllLog = async (req: Request, res: Response) => {
    try {
        const news = await databaseService.log.find({}).populate('userId','username')
        res.status(200).json(news)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get log', error: error.message })
    }
}
export const getLogWithOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params
    try {
        const comments = await databaseService.log.find({ orderId: orderId }).populate('userId','username')
        res.status(200).json(comments)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get log', error: error.message })
    }
}
