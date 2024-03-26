import { Router } from 'express'
import {
  signUp,
  deleteUsers,
  getAllUsers,
  getUserById,
  paginationUsers,
  getUsernameById,
  updateAvatar,
  updatePass
} from '../controllers/users.controllers'

const usersRoutes = Router()
usersRoutes.get('/pagination/:n/:p', paginationUsers)
usersRoutes.get('/', getAllUsers)
usersRoutes.get('/one/:_id', getUserById)
usersRoutes.get('/username/:userId', getUsernameById)
usersRoutes.post('/avatar', updateAvatar)
usersRoutes.post('/pass', updatePass)
usersRoutes.post('/', signUp)
usersRoutes.delete('/', deleteUsers)

export default usersRoutes
