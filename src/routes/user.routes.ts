import { Router } from 'express'
import {
  signUp,
  deleteUsers,
  getAllUsers,
  getUserById,
  paginationUsers
} from '../controllers/users.controllers'

const usersRoutes = Router()
usersRoutes.post('/pagination', paginationUsers)
usersRoutes.get('/', getAllUsers)
usersRoutes.get('/one/:_id', getUserById)
usersRoutes.post('/', signUp)
usersRoutes.delete('/:userId', deleteUsers)

export default usersRoutes
