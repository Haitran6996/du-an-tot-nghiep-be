import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationGift = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params
        if (n == null || p == null) {
            const n = 10
            const p = 1
        }
        const data = await databaseService.comments.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ])
        const total = await databaseService.comments.aggregate([
            { $count: "total" }
        ])
        const Total = total[0].total
        res.status(201).json({ data, p, n, Total })
    } catch (error: any) {
        console.error('Error get data:', error)
        res.status(500).json({ message: 'Failed to data', error: error.message })
    }
}

export const addGift = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, code, sale, start, expire, content } = req.body // Mảng options rỗng

        // check user
        const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // check product
        if (checkRoleUser[0]._id == userId && checkRoleUser[0]._id == 0) {
            const giftInsertion = await databaseService.gifts.create({
                code,
                sale,
                start,
                expire,
                content
            }
            )
            res.status(201).json({
                message: 'Giftcode created successfully',
                giftId: giftInsertion
            })
        }
    } catch (error: any) {
        console.error('Error create Gift:', error)
        res.status(500).json({ message: 'Failed to create Gift', error: error.message })
    }
}

export const updateGift = async (req: Request, res: Response) => {
    try {
        const { giftId }= req.params
        const updateData = req.body // Dữ liệu cập nhật được gửi từ client

        // Tìm sản phẩm để cập nhật
        const gift: any = await databaseService.gifts.findById(giftId)

        if (!gift) {
            return res.status(404).json({ message: 'Giftcode không tồn tại' })
        }

        // Cập nhật chỉ các thuộc tính được gửi từ client
        Object.keys(updateData).forEach((key: any) => {
            gift[key] = updateData[key]
        })

        // Lưu sản phẩm đã cập nhật
        await gift.save()

        // Trả về thông tin sản phẩm đã cập nhật
        res.json({ message: 'Cập nhật giftcode thành công', gift })
    } catch (error) {
        console.error('Lỗi khi cập nhật giftcode:', error)
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật giftcode' })
    }
}

export const deleteGift = async (req: Request, res: Response, next: NextFunction) => {
    const { giftId, userId, role } = req.params

    try {
        const checkCommentId = await databaseService.comments.find({ _id: giftId })
        const checkRoleUser = await databaseService.users.find({ _id: userId })

        if (checkCommentId[0].userId == checkRoleUser[0]._id && Number(role) == checkRoleUser[0].role) {
            await databaseService.comments.deleteOne({ _id: new ObjectId(giftId) })

            res.status(200).json({
                message: 'Giftcode deleted successfully'
            })
        }
    } catch (error: any) {
        console.error('Error deleting Gift:', error)
        res.status(500).json({ message: 'Failed to delete Gift', error: error.message })
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
export const getGiftWithCode = async (req: Request, res: Response) => {
    const { code } = req.params
    try {
        const gift = await databaseService.gifts.find({ code: code })
        res.status(200).json(gift)
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get:', error: error.message })
    }
}
