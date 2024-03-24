import { NextFunction, Request, Response } from 'express'

import databaseService from '../services/database.services'
import OrderModel from '../models/Order.model'
import CartModel from '../models/Cart.model'
import mongoose from 'mongoose'

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
      .populate('userId', 'name email -_id')
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.product',
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
  try {
    // Giả sử req.body.userId là ID của người dùng đang đặt hàng
    const cart = await databaseService.carts.findOne({ userId: req.body.userId }).populate({
      path: 'items.product',
      populate: {
        path: 'options', // Populate nested options của product
        model: 'options' // Đảm bảo tên mô hình là đúng
      }
    })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    let totalAmount = 0

    // Lặp qua từng sản phẩm trong giỏ hàng và tính tổng tiền
    cart.items.forEach((item: any) => {
      const productPrice = item?.product?.price // Giá của sản phẩm
      const quantity = item?.quantity // Số lượng sản phẩm
      totalAmount += productPrice * quantity // Tính tổng tiền cho sản phẩm này
    })

    const orderData = {
      userId: cart.userId,
      items: cart.items.map((item: any) => ({
        product: {
          _id: item?.product?._id,
          name: item?.product?.name,
          description: item?.product?.description,
          date: item?.product?.date,
          thumbnail: item?.product?.thumbnail,
          price: item?.product?.price,
          options: [...item.options]
          // This should now be populated with option objects
        },
        quantity: item?.quantity
      })),
      status: req.body.status,
      totalAmount: totalAmount,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    }

    const newOrder = new OrderModel(orderData)
    const savedOrder = await newOrder.save()
    if (savedOrder) await placeOrder(req.body.userId, cart.items)
    res.status(201).json(savedOrder)
  } catch (err) {
    console.log(err, 'errr')
    res.status(500).json(err)
  }
}
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!['pending', 'paid', 'completed', 'shipped', 'cancelled'].includes(status)) {
      return res.status(400).send({ message: 'Invalid status value' })
    }

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
  } catch (error: any) {
    res.status(500).send({ message: 'Server error', error })
  }
}
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    const orders = await databaseService.orders
      .find({ userId: userId })
      .sort({ createdAt: -1 })
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
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await databaseService.orders
      .find({})
      .sort({ createdAt: -1 })
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
