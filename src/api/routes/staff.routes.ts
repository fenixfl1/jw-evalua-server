import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  createStaffSchema,
  updateStaffSchema,
} from '@src/validators/staff.schema'
import {
  PATH_CREATE_STAFF,
  PATH_GET_ONE_STAFF,
  PATH_GET_STAFF_PAGINATION,
  PATH_VALIDATE_IDENTITY_DOCUMENT,
} from '@src/constants/routes'
import {
  createStaffController,
  getOneStaffController,
  getPaginationController,
  updateStaffController,
  validateIdentityDocumentController,
} from '../controllers/staff.controller'
import { advancedConditionSchema } from '@src/validators/condition.schema'

const staffRouter = Router()

staffRouter
  .route(PATH_CREATE_STAFF)
  .post(validateSchema(createStaffSchema), createStaffController)
  .put(validateSchema(updateStaffSchema), updateStaffController)

staffRouter.get(PATH_GET_ONE_STAFF, getOneStaffController)

staffRouter.get(
  PATH_VALIDATE_IDENTITY_DOCUMENT,
  validateIdentityDocumentController
)

staffRouter.post(
  PATH_GET_STAFF_PAGINATION,
  validateSchema(advancedConditionSchema),
  getPaginationController
)

export default staffRouter
