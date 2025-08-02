import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import { createStaffSchema } from '@src/validators/staff.schema'
import {
  PATH_CREATE_STAFF,
  PATH_GET_STAFF_PAGINATION,
} from '@src/constants/routes'
import {
  createStaffController,
  getPaginationController,
} from '../controllers/staff.controller'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'

const staffRouter = Router()

staffRouter.post(
  PATH_CREATE_STAFF,
  validateSchema(createStaffSchema),
  createStaffController
)

staffRouter.post(
  PATH_GET_STAFF_PAGINATION,
  validateSchema(advancedConditionSchema),
  getPaginationController
)

export default staffRouter
