import { Router } from 'express'
import {
  signUp,
  deleteUsers,
  getAllUsers,
  getUserById,
  paginationUsers,
  getUsernameById
} from '../controllers/users.controllers'

const usersRoutes = Router()
usersRoutes.get('/pagination/:n/:p', paginationUsers)
usersRoutes.get('/', getAllUsers)
usersRoutes.get('/one/:_id', getUserById)
usersRoutes.get('/username/:userId',getUsernameById)
usersRoutes.post('/', signUp)
usersRoutes.delete('/:userId', deleteUsers)

export default usersRoutes
