import { Router } from 'express'
import {
  signUp,
  deleteUsers,
  getAllUsers,
  getUserById
} from '../controllers/users.controllers'

const usersRoutes = Router()

usersRoutes.get('/', getAllUsers)
usersRoutes.get('/:userId', getUserById)
usersRoutes.post('/', signUp)
usersRoutes.delete('/:userId', deleteUsers)

export default usersRoutes
