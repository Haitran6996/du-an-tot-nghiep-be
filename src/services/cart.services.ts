/* eslint-disable prefer-const */
import { Request, Response } from 'express'
import CartModel from '../models/Cart.model'

export async function addToCartServices(req: Request, res: Response) {
  try {
    const { userId, productId, options, quantity } = req.body

    let cart = await CartModel.findOne({ userId })

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.product._id.toString() === productId && item.options.includes(options)
      )

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex]
        if (existingItem.quantity !== undefined) {
          existingItem.quantity += quantity
        } else {
          existingItem.quantity = quantity
        }
      } else {
        cart.items.push({ product: productId, options, quantity })
      }

      await cart.save()
    } else {
      const newCart = new CartModel({
        userId,
        items: [{ product: productId, options, quantity }]
      })
      cart = await newCart.save()
    }

    return res.json(cart)
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}

export async function updateCartServices(req: Request, res: Response) {
  try {
    const { userId, productId, quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).send('Quantity must be greater than 0')
    }

    // Tìm giỏ hàng của người dùng
    let cart = await CartModel.findOne({ userId })

    if (!cart) {
      return res.status(404).send('Cart not found')
    }

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === productId)

    if (itemIndex > -1) {
      // Cập nhật số lượng sản phẩm
      cart.items[itemIndex].quantity = quantity
      await cart.save()
      return res.json(cart) // Sử dụng return ở đây
    } else {
      return res.status(404).send('Item not found in cart')
    }
  } catch (error: any) {
    return res.status(500).send(error.message)
  }
}

export async function deleteItemCartServices(req: Request, res: Response) {
  try {
    const { userId, productId } = req.body

    // Tìm giỏ hàng của người dùng
    let cart = await CartModel.findOne({ userId })

    if (!cart) {
      return res.status(404).send('Cart not found')
    }

    // Kiểm tra sản phẩm có trong giỏ hàng không
    const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === productId)

    if (itemIndex > -1) {
      // Xóa sản phẩm khỏi giỏ hàng
      cart.items.splice(itemIndex, 1)
      await cart.save()
      return res.json(cart)
    } else {
      res.status(404).send('Item not found in cart')
    }
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}
export async function getCartServices(req: Request, res: Response) {
  const userId = req.params.userId
  const cart = await CartModel.findOne({ userId }).populate('items.product').populate('items.options')

  if (!cart) {
    // Thay vì ném lỗi, bạn có thể trả về null hoặc undefined để biểu thị không tìm thấy cart,
    // hoặc trả về một object đặc biệt nào đó.
    return null
  }

  let totalAmount = 0
  cart.items.forEach((item: any) => {
    const productPrice = item?.product?.price
    const quantity = item?.quantity
    totalAmount += productPrice * quantity
  })

  return res.json({ cart, totalAmount })
}
