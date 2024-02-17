import { Request, Response, NextFunction, Router } from 'express'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { username, mail, password, role } = req.body
    //Check tài khoản có trong db hay không
    const checkExist = await databaseService.users.find({ username: username }).select('+username -password -role -image -status -mail')
    // Tạo tài khoản mới
    if (role != 0 && checkExist == null) {
      const usersInsertion = await databaseService.users.create({
        username,
        mail,
        password,
        role
      })

      res.status(201).json({
        message: 'User created successfully',
        userId: usersInsertion._id
      })
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Failed to create user', error: error.message })
  }
}

export const deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  try {
    await databaseService.users.deleteOne({ _id: new ObjectId(userId) })

    res.status(200).json({
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Failed to delete user', error: error.message })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await databaseService.users.find({}).select('-password')
    res.status(200).json(users)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get users', error: error.message })
  }
}
export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params
  try {
    const pipeline = [
      { $match: { _id: new ObjectId(productId) } },
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'optionsDetails'
        }
      }
    ]

    const result = await databaseService.products.aggregate(pipeline)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get products', error: error.message })
  }
}
