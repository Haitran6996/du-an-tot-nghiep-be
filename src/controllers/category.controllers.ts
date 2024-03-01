import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params
        if (n == null || p == null) {
            const n = 10
            const p = 1
        }
        const data = await databaseService.categorys.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ])
        const total = await databaseService.categorys.aggregate([
            { $count: "total" }
        ])
        const Total = total[0].total
        res.status(201).json({ data, p, n, Total })
    } catch (error: any) {
        console.error('Error get data:', error)
        res.status(500).json({ message: 'Failed to data', error: error.message })
    }
}

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { userId, role, name, image } = req.body // Mảng options rỗng

        // check user
        const checkRoleUser = await databaseService.users.find({ _id: userId, role: role })
        // check product
        if (checkRoleUser[0]._id == userId && checkRoleUser[0]._id == 0) {
            const CategoryInsertion = await databaseService.categorys.create({
                name,
                image
            }
            )
            res.status(201).json({
                message: 'Categorycode created successfully',
                CategoryId: CategoryInsertion
            })
        }
    } catch (error: any) {
        console.error('Error create Category:', error)
        res.status(500).json({ message: 'Failed to create Category', error: error.message })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { CategoryId }= req.params
        const updateData = req.body // Dữ liệu cập nhật được gửi từ client

        // Tìm sản phẩm để cập nhật
        const Category: any = await databaseService.categorys.findById(CategoryId)

        if (!Category) {
            return res.status(404).json({ message: 'Categorycode không tồn tại' })
        }

        // Cập nhật chỉ các thuộc tính được gửi từ client
        Object.keys(updateData).forEach((key: any) => {
            Category[key] = updateData[key]
        })

        // Lưu sản phẩm đã cập nhật
        await Category.save()

        // Trả về thông tin sản phẩm đã cập nhật
        res.json({ message: 'Cập nhật Categorycode thành công', Category })
    } catch (error) {
        console.error('Lỗi khi cập nhật Categorycode:', error)
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật Categorycode' })
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { CategoryId, userId, role } = req.params

    try {
        const checkRoleUser = await databaseService.users.find({ _id: userId })

        if ( Number(role) == checkRoleUser[0].role && Number(role) == 0) {
            await databaseService.categorys.deleteOne({ _id: new ObjectId(CategoryId) })

            res.status(200).json({
                message: 'Categorycode deleted successfully'
            })
        }
    } catch (error: any) {
        console.error('Error deleting Category:', error)
        res.status(500).json({ message: 'Failed to delete Category', error: error.message })
    }
}

export const getAllCategory = async (req: Request, res: Response) => {
    const { userId, role } = req.params
    try {
        const checkAdmin = await databaseService.users.find({ _id: userId, role: role })
        if (checkAdmin[0].role == 0) {
            const news = await databaseService.categorys.find({})
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message })
    }
}