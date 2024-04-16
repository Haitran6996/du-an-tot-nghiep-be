import { NextFunction, Request, Response } from 'express'

import databaseService from '../services/database.services'
import OrderModel from '../models/Order.model'
import CartModel from '../models/Cart.model'
import Option from '../models/Options.model'
import mongoose from 'mongoose'
import { addLog } from './log.controllers'
import { get } from 'http'

async function placeOrder(userId: string, items: any[]) {
  await CartModel.findOneAndDelete({ userId })
}
export async function getOne(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try {
    // Kiểm tra xem ID có phải là một ObjectId hợp lệ của MongoDB không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID.' })
    }

    // Tìm đơn hàng theo ID và populate thông tin liên quan nếu cần
    const order = await databaseService.orders
      .findById(id)
      .populate('user_cancel_order')
      .populate('userId', 'name email -_id')
      .sort({ createdAt: -1 })
      .populate({
        path: 'items._id',
        populate: {
          path: 'options', // Populate nested options của product
          model: 'options' // Đảm bảo tên mô hình là đúng
        }
      }) // Sắp xếp từ mới nhất đến cũ nhất

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    res.json(order)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Server error occurred.' })
  }
}

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, role, orderId } = req.body
  const newStatus = req.body.status
  try {
    const cart = await databaseService.carts.findOne({ userId: req.body.userId }).populate({
      path: 'items.product',
      populate: {
        path: 'options',
        model: 'options' // Đảm bảo tên mô hình là đúng
      }
    })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    let totalAmount = 0

    const itemsWithUpdatedPrice = cart.items.map((item: any) => {
      // Tính giá dựa trên option được chọn
      let itemTotalPrice = 0
      item.product.options.forEach((option: any) => {
        if (item.options.includes(option._id.toString())) {
          itemTotalPrice = option.price * item.quantity
        }
      })

      totalAmount += itemTotalPrice // Cập nhật tổng tiền cho đơn hàng

      // Trả về item mới với giá đã được cập nhật
      return {
        product: {
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          date: item.product.date,
          thumbnail: item.product.thumbnail,
          price: itemTotalPrice, // Cập nhật giá dựa trên option được chọn
          options: [...item.options]
        },
        quantity: item.quantity
      }
    })

    const orderData = {
      userId: cart.userId,
      items: itemsWithUpdatedPrice,
      status: req.body.status,
      totalAmount: totalAmount,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    }

    const newOrder = new OrderModel(orderData)
    const savedOrder = await newOrder.save()
    if (savedOrder) {
      await placeOrder(req.body.userId, cart.items)
      res.status(201).json(savedOrder)
      addLog(userId, role, orderId, 'none', newStatus, totalAmount, '')
    }
  } catch (err) {
    console.log(err, 'errr')
    res.status(500).json(err)
  }
}

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params

    if (req.body.status === 'cancelled' && req.body.desc === '' && !req.body.user_cancel_order) {
      return res.status(404).send({ message: 'truyền thiếu trường!, kiểm tra lại thông tin' })
    }
    const { status, userId, role, oldStatus} = req.body
    const newStatus = req.body.status

    if (!['pending', 'paid', 'completed', 'shipped', 'cancelled'].includes(status)) {
      return res.status(400).send({ message: 'Invalid status value' })
    }
    const getOd = await databaseService.orders.findById(orderId)
    const totalAmount = getOd?.totalAmount
    const order = await databaseService.orders.findByIdAndUpdate(orderId, { status }, { new: true })

    if (!order) {
      return res.status(404).send({ message: 'Order not found' })
    }

    // Nếu đơn hàng được cập nhật thành completed, cập nhật trường purchases cho từng sản phẩm
    if (status === 'completed') {
      await Promise.all(
        order.items.map(async (item: any) => {
          const productId = item.product._id
          // Tăng trường purchases lên 1
          await databaseService.products.findByIdAndUpdate(productId, { $inc: { purchases: 1 } })
        })
      )
    }

    res.send(order)
    if (req.body.status === 'cancelled') {
      const note = req.body.desc
      addLog(userId, role, orderId, oldStatus, newStatus, totalAmount, note)
    } else {
      addLog(userId, role, orderId, oldStatus, newStatus, totalAmount, '')
    }

  } catch (error: any) {
    res.status(500).send({ message: 'Server error', error })
  }
}
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    const orders = await databaseService.orders.findOne({ userId: userId }).sort({ createdAt: -1 })
    // .populate({
    //   path: 'items._id',
    //   populate: {
    //     path: 'options', // Populate nested options của product
    //     model: 'options'
    //     // Đảm bảo tên mô hình là đúng
    //   }
    // }) // Sắp xếp từ mới nhất đến cũ nhất

    res.status(200).json(orders)
  } catch (error: any) {
    res.status(500).send({ message: 'Server error', error: error.message })
  }
}
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await databaseService.orders
      .find({})
      .sort({ createdAt: -1 })
      .populate('user_cancel_order')
      .populate('userId')
      .populate({
        path: 'items.product',
        populate: {
          path: 'options', // Populate nested options của product
          model: 'options' // Đảm bảo tên mô hình là đúng
        }
      }) // Sắp xếp từ mới nhất đến cũ nhất

    res.status(200).json(orders)
  } catch (error: any) {
    res.status(500).send({ message: 'Server error', error: error.message })
  }
}
