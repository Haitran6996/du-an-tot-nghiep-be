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
        const { name, image } = req.body // Mảng options rỗng
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
    catch (error: any) {
        console.error('Error create Category:', error)
        res.status(500).json({ message: 'Failed to create Category', error: error.message })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params
    const { name, image } = req.body
    try {
        const updateResult = await databaseService.categorys.findByIdAndUpdate(
            { _id: categoryId },
            {
                name: name,
                image: image,
            }
        )
        res.status(200).json({ message: 'Cập nhật Category thành công' })
    } catch (error) {
        console.error('Lỗi khi cập nhật Categorycode:', error)
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật Categorycode' })
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params

    try {
        await databaseService.categorys.deleteOne({ _id: new ObjectId(categoryId) })
        res.status(200).json({
            message: 'Categorycode deleted successfully'
        })
    }
    catch (error: any) {
        console.error('Error deleting Category:', error)
        res.status(500).json({ message: 'Failed to delete Category', error: error.message })
    }
}

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        {
            const news = await databaseService.categorys.find({})
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message })
    }
}
export const getOneCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params
        {
            const news = await databaseService.categorys.find({ _id: categoryId })
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all category', error: error.message })
    }
}