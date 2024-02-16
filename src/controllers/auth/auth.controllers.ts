import { Request, Response, NextFunction, Router } from 'express'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import databaseService from 'src/services/database.services'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kết nối tới database nếu cần
    const { username, mail, password, role } = req.body
    //Check tài khoản có trong db hay không
    const checkExistUsername = await databaseService.users.findOne({username:username});
	if (checkExistUsername) {
		return res.status(401).json('Tên đăng nhập đã được sử dụng.');
	}
    const checkExistMail = await databaseService.users.findOne({mail:mail});
	if (checkExistMail) {
		return res.status(401).json('Mail đã được sử dụng.');
	}
    // Tạo tài khoản mới
    if (role != 0) {
      const usersInsertion = await databaseService.users.create({
        username,
        mail,
        password,
        role
      })

      res.status(201).json({
        message: 'Register successfully',
        userId: usersInsertion._id
      })
    }
    else if(role == 0){
        res.status(401).json('Create failed')
    }
  } catch (error: any) {
    console.error('Error register:', error)
    res.status(500).json({ message: 'Failed to register', error: error.message })
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
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

export const getToken = async (req: Request, res: Response) => {
  try {
    const { username, } = req.body
    const token = await databaseService.users.find({}).select('-password')
    res.status(200).json(token)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get users', error: error.message })
  }
}
export const login = async (req: Request, res: Response) => {
    const {username,password} = req.body;
    try {
    // get data
	const user = await databaseService.users.findOne({username:username});
	if (!user) {
		return res.status(401).json('Tên đăng nhập hoặc mật khẩu không chính xác.');
	}
    // check password
	const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    
	if (!isPasswordValid) {
        return res.status(401).json(user),
		res.status(401).json('Tên đăng nhập hoặc mật khẩu không chính xác.');
	}
    return res.json({
		msg: 'Đăng nhập thành công.',
		user
	});
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi', error: error.message })
  }
}
