import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'
import {
  createRoleController,
  getOneRoleController,
  getRolePaginationController,
  updateRoleController,
} from '../controllers/role.controller'
import {
  PATH_CREATE_UPDATE_ROLE,
  PATH_GET_ONE_ROLE,
  PATH_GET_ROLE_PAGINATION,
} from '@src/constants/routes'
import { createRoleSchema, updateRoleSchema } from '@src/validators/role.schema'

const roleRouter = Router()

roleRouter
  .route(PATH_CREATE_UPDATE_ROLE)
  .post(validateSchema(createRoleSchema), createRoleController)
  .put(validateSchema(updateRoleSchema), updateRoleController)

roleRouter.get(PATH_GET_ONE_ROLE, getOneRoleController)

roleRouter.post(
  PATH_GET_ROLE_PAGINATION,
  validateSchema(advancedConditionSchema),
  getRolePaginationController
)

export default roleRouter
