import { Request, Response, NextFunction, Router } from 'express'
import mongoose, { Schema, Document } from 'mongoose'
import md5 from 'md5'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import databaseService from '../../services/database.services'

const hash = 8

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { username, mail, password, role } = req.body
    const hashPassword = md5(password)
    //Check tài khoản có trong db hay không
    const checkExistUsername = await databaseService.users.findOne({ username: username })
    if (checkExistUsername) {
      return res.status(401).json('Tên đăng nhập đã được sử dụng.')
    }
    const checkExistMail = await databaseService.users.findOne({ mail: mail })
    if (checkExistMail) {
      return res.status(401).json('Mail đã được sử dụng.')
    }
    // Tạo tài khoản mới
    if (role != 0) {
      const usersInsertion = await databaseService.users.create({
        username,
        mail,
        password: hashPassword,
        role
      })

      res.status(201).json({
        message: 'Register successfully',
        userId: usersInsertion._id
      })
    } else if (role == 0) {
      res.status(401).json('Create failed')
    }
  } catch (error: any) {
    console.error('Error register:', error)
    res.status(500).json({ message: 'Failed to register', error: error.message })
  }
}

export const getToken = async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    const token = await databaseService.users.find({}).select('-password')
    res.status(200).json(token)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get users', error: error.message })
  }
}
export const login = async (req: Request, res: Response) => {
  const { username, password, JWT_KEY } = req.body
  try {
    // get data
    const user = await databaseService.users.find({ username }).select('-mail ')
    if (!user) {
      return res.status(401).json('Tên đăng nhập không chính xác.')
    }

    // check password
    const hashPassword = md5(password)
    if (hashPassword != user[0].password) {
      return res.status(401).json(' mật khẩu không chính xác.')
    }
    const userDelPass = await databaseService.users.find({ username }).select('-password -refreshToken')

    const payload = {
      _id: userDelPass[0]._id,
      mail: userDelPass[0].mail,
      role: userDelPass[0].role
    }
    const options = { expiresIn: '7d' }

    const Token = jwt.sign(payload, JWT_KEY, options)
    await databaseService.users.findByIdAndUpdate({ _id: userDelPass[0]._id }, { refreshToken: Token })
    return res.json({
      msg: 'Đăng nhập thành công.',
      userDelPass,
      Token
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi', error: error.message })
  }
}
