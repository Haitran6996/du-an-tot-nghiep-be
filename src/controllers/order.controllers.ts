import { NextFunction, Request, Response } from 'express'

import databaseService from '../services/database.services'
import OrderModel from 'src/models/Order.model'

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Giả sử req.body.userId là ID của người dùng đang đặt hàng
    const cart = await databaseService.carts
      .findOne({ userId: req.body.userId })
      .populate('items.product')
      .populate('items.options')

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    console.log(cart, 'cart')

    // Tạo ra một object đơn hàng từ giỏ hàng

    // Creating an order object from the cart
    const orderData = {
      userId: cart.userId,
      items: cart.items.map((item: any) => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          date: item.product.date,
          thumbnail: item.product.thumbnail,
          price: item.product.price,
          options: [...item.options]
          // This should now be populated with option objects
        },
        quantity: item.quantity
      })),
      status: 'pending',
      totalAmount: cart.totalAmount
    }

    const newOrder = new OrderModel(orderData)
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (err) {
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

    res.send(order)
  } catch (error) {
    res.status(500).send({ message: 'Server error', error })
  }
}
