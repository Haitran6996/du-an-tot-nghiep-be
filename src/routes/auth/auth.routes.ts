import { Router } from 'express'
import {
  register,
  login,
} from '../../controllers/auth/auth.controllers'

const authRoutes = Router()

authRoutes.post('/login', login)
authRoutes.post('/register', register)
// authRoutes.put('/refresh', refreshToken)

export default authRoutes