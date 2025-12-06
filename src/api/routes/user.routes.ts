import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  changeUserController,
  createUserController,
  getUerController,
  getUserPaginationController,
  updateUserController,
} from '../controllers/user.controller'
import {
  changePasswordSchema,
  createUserSchema,
  updateUseSchema,
} from '@src/validators/user.schema'
import {
  PATH_CHANGE_PASSWORD,
  PATH_GET_USER,
  PATH_GET_USER_PAGINAtION,
  PATH_USER,
} from '@src/constants/routes'
import { advancedConditionSchema } from '@src/validators/condition.schema'
const userRouter = Router()

userRouter.post(
  PATH_USER,
  validateSchema(createUserSchema),
  createUserController
)
userRouter.put(PATH_USER, validateSchema(updateUseSchema), updateUserController)
userRouter.put(
  PATH_CHANGE_PASSWORD,
  validateSchema(changePasswordSchema),
  changeUserController
)
userRouter.get(PATH_GET_USER, getUerController)
userRouter.post(
  PATH_GET_USER_PAGINAtION,
  validateSchema(advancedConditionSchema),
  getUserPaginationController
)

export default userRouter
