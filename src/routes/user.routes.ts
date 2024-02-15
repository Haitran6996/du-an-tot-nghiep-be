import { Router } from 'express'
import {
  signUp,
  deleteUsers,
  getAllUsers
} from '../controllers/users.controllers'

const usersRoutes = Router()

usersRoutes.get('/', getAllUsers)
// usersRoutes.get('/:productId', getOneUsers)
usersRoutes.post('/', signUp)
usersRoutes.delete('/:userId', deleteUsers)

export default usersRoutes
