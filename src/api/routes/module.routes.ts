import {
  PATH_CREATE_OR_UPDATE_MODULE_MEMBERS,
  PATH_CREATE_UPDATE_MODULE,
  PATH_GET_MODULE_MEMBERS,
  PATH_GET_PAGINATED_MODULES,
} from '@src/constants/routes'
import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  createModuleController,
  createOrUpdateMembersController,
  getModuleMembersController,
  getPaginatedModulesController,
  updateModuleController,
} from '../controllers/module.controller'
import {
  createModuleSchema,
  createOrUpdateMembersSchema,
  getModuleMembersSchema,
  updateModuleSchema,
} from '@src/validators/module.schema'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'

const moduleRouter = Router()

moduleRouter.post(
  PATH_CREATE_UPDATE_MODULE,
  validateSchema(createModuleSchema),
  createModuleController
)
moduleRouter.put(
  PATH_CREATE_UPDATE_MODULE,
  validateSchema(updateModuleSchema),
  updateModuleController
)
moduleRouter.post(
  PATH_GET_PAGINATED_MODULES,
  validateSchema(advancedConditionSchema),
  getPaginatedModulesController
)
moduleRouter.post(
  PATH_CREATE_OR_UPDATE_MODULE_MEMBERS,
  validateSchema(createOrUpdateMembersSchema),
  createOrUpdateMembersController
)
moduleRouter.post(
  PATH_GET_MODULE_MEMBERS,
  validateSchema(getModuleMembersSchema),
  getModuleMembersController
)

export default moduleRouter
