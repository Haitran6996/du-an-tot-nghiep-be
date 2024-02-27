import { Request, Response, NextFunction, Router } from 'express'

import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'

export const paginationUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { n, p } = req.params
    if (n == null || p == null) {
      const n = 15
      const p = 1
    }
    const data = await databaseService.users.aggregate([
      { $match: { role: 1 } },
      { $skip: (Number(p) * Number(n)) - Number(n) },
      { $limit: Number(n) }
    ])
    const total = await databaseService.users.aggregate([
      { $match: { role: 1 } },
      { $count: "total" }
    ])
    const Total = total[0].total
    res.status(201).json({ data, p, n, Total })
  } catch (error: any) {
    console.error('Error get data:', error)
    res.status(500).json({ message: 'Failed to data', error: error.message })
  }
}

export const getUsernameById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const {userId } = req.params
    const username = await databaseService.users.findById({ userId }). select('+username -password -role -image -status -mail -refreshToken')
    res.status(201).json({ username })
  } catch (error: any) {
    console.error('Error get data:', error)
    res.status(500).json({ message: 'Failed to data', error: error.message })
  }
}

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

export const getUserById = async (req: Request, res: Response) => {
  const { _id } = req.params
  try {
    const user = await databaseService.users.find({ _id: _id }).select('-password -refreshToken');
    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get data Users', error: error.message })
  }
}
