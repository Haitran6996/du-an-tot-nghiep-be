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
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const updateCart = async (req: Request, res: Response) => {
  try {
    const data = await updateCartServices(req, res)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
export const deleteItemCart = async (req: Request, res: Response) => {
  try {
    const data = await deleteItemCartServices(req, res)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
export const getCart = async (req: Request, res: Response) => {
  try {
    const data = await getCartServices(req, res)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
