import { Request, Response, NextFunction, Router } from 'express'

import mongoose, { Schema, Document } from 'mongoose'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationSlider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { n, p } = req.params
        if (n == null || p == null) {
            const n = 10
            const p = 1
        }
        const data = await databaseService.slider.aggregate([
            { $skip: (Number(p) * Number(n)) - Number(n) },
            { $limit: Number(n) }
        ])
        const total = await databaseService.slider.aggregate([
            { $count: "total" }
        ])
        const Total = total[0].total
        res.status(201).json({ data, p, n, Total })
    } catch (error: any) {
        console.error('Error get data:', error)
        res.status(500).json({ message: 'Failed to data', error: error.message })
    }
}

export const addSlider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Kết nối tới database nếu cần
        const { productId, content, image } = req.body // Mảng options rỗng
        const sliderInsertion = await databaseService.slider.create({
            productId, content, image
        }
        )
        res.status(201).json({
            message: 'slidercode created successfully',
            sliderId: sliderInsertion
        })
    }
    catch (error: any) {
        console.error('Error create slider:', error)
        res.status(500).json({ message: 'Failed to create slider', error: error.message })
    }
}

export const updateSlider = async (req: Request, res: Response) => {
    const { sliderId } = req.params
    const { productId, content, image } = req.body
    try {
        const updateResult = await databaseService.slider.findByIdAndUpdate(
            { _id: sliderId },
            {
                productId: productId,
                content: content,
                image: image,
            }
        )
        res.status(200).json({ message: 'Cập nhật slider thành công' })
    } catch (error) {
        console.error('Lỗi khi cập nhật slidercode:', error)
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật slidercode' })
    }
}

export const deleteSlider = async (req: Request, res: Response, next: NextFunction) => {
    const { sliderId } = req.params

    try {
        await databaseService.slider.deleteOne({ _id: new ObjectId(sliderId) })
        res.status(200).json({
            message: 'slidercode deleted successfully'
        })
    }
    catch (error: any) {
        console.error('Error deleting slider:', error)
        res.status(500).json({ message: 'Failed to delete slider', error: error.message })
    }
}

export const getAllSlider = async (req: Request, res: Response) => {
    try {
        {
            const news = await databaseService.slider.find({})
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all slider', error: error.message })
    }
}
export const getOneSlider = async (req: Request, res: Response) => {
    try {
        const { sliderId } = req.params
        {
            const news = await databaseService.slider.find({ _id: sliderId })
            res.status(200).json(news)
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get all slider', error: error.message })
    }
}