import { Router } from 'express'
import {
  register,
  login,
  createAdmin
} from '../../controllers/auth/auth.controllers'

const authRoutes = Router()

authRoutes.post('/login', login)
authRoutes.post('/register', register)
authRoutes.post('/ccrreetteeAdmin', createAdmin)
// authRoutes.put('/refresh', refreshToken)

export default authRoutes