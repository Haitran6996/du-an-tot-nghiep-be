/* eslint-disable prefer-const */
import { Request, Response } from 'express'
import CartModel from 'src/models/Cart.model'

export async function addToCartServices(req: Request, res: Response) {
  try {
    const { userId, productId, options, quantity } = req.body

    // Tìm giỏ hàng của người dùng
    let cart = await CartModel.findOne({ userId })

    if (cart) {
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId)

      if (itemIndex > -1) {
        // Sản phẩm đã tồn tại, cập nhật số lượng;la
        let item: any = cart.items[itemIndex]
        item.quantity += quantity
        cart.items[itemIndex] = item
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ product: productId, options, quantity })
      }
      await cart.save()
    } else {
      // Tạo giỏ hàng mới nếu người dùng chưa có giỏ hàng
      const newCart = new CartModel({
        userId,
        items: [{ product: productId, options, quantity }]
      })
      await newCart.save()
      cart = newCart
    }

    return cart
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
    const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId)

    if (itemIndex > -1) {
      // Cập nhật số lượng sản phẩm
      cart.items[itemIndex].quantity = quantity
      await cart.save()
      return cart
    } else {
      res.status(404).send('Item not found in cart')
    }
  } catch (error: any) {
    res.status(500).send(error.message)
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
    const itemIndex = cart.items.findIndex((item: any) => item.product.toString() === productId)

    if (itemIndex > -1) {
      // Xóa sản phẩm khỏi giỏ hàng
      cart.items.splice(itemIndex, 1)
      await cart.save()
      return cart
    } else {
      res.status(404).send('Item not found in cart')
    }
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}
export async function getCartServices(req: Request, res: Response) {
  try {
    const userId = req.params.userId
    const cart = await CartModel.findOne({ userId }).populate('items.product').populate('items.options')

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    return cart
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ message: 'Failed to get cart', error: error.message })
  }
}
