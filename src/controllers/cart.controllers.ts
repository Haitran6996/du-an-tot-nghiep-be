// variantController.ts
import { Request, Response } from 'express'
import {
  addToCartServices,
  updateCartServices,
  deleteItemCartServices,
  getCartServices
} from '../services/cart.services'

export const addToCart = async (req: Request, res: Response) => {
  try {
    const data = await addToCartServices(req, res)
    return data
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const updateCart = async (req: Request, res: Response) => {
  try {
    const data = await updateCartServices(req, res)
    return data
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
export const deleteItemCart = async (req: Request, res: Response) => {
  try {
    const data = await deleteItemCartServices(req, res)
    return data
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
export const getCart = async (req: Request, res: Response) => {
  try {
    const data = await getCartServices(req, res)
    if (!data) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    res.json(data)
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ message: 'Failed to get cart', error: error.message })
  }
}
