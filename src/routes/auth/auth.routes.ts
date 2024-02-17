import { Router } from 'express'
import {
  register,
  login,
  refreshToken
} from 'src/controllers/auth/auth.controllers'

const authRoutes = Router()

authRoutes.get('/login', login)
authRoutes.post('/register', register)
// authRoutes.put('/refresh', refreshToken)

export default authRoutes