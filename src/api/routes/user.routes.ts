import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  createUserController,
  getUerController,
  getUserPaginationController,
} from '../controllers/user.controller'
import { createUserSchema } from '@src/validators/user.schema'
import {
  PATH_GET_USER,
  PATH_GET_USER_PAGINAtION,
  PATH_USER,
} from '@src/constants/routes'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'
const userRouter = Router()

userRouter.post(
  PATH_USER,
  validateSchema(createUserSchema),
  createUserController
)
userRouter.get(PATH_GET_USER, getUerController)
userRouter.post(
  PATH_GET_USER_PAGINAtION,
  validateSchema(advancedConditionSchema),
  getUserPaginationController
)

export default userRouter
