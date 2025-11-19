import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  PATH_GET_MODULE_EFFICIENCY,
  PATH_GET_MODULE_WORKED_MINUTES,
  PATH_GET_PROCESS_AUDIT,
  PATH_POST_MODULE_EFFICIENCY,
  PATH_POST_PROCESS_AUDIT,
} from '@src/constants/routes'
import {
  getModuleEfficiencyController,
  getModuleWorkedMinutesController,
  getProcessAuditController,
  postModuleEfficiencyController,
  postProcessAuditController,
} from '../controllers/production-metrics.controller'
import {
  createProcessAuditSchema,
  moduleEfficiencySchema,
} from '@src/validators/production.schema'

const productionRouter = Router()

productionRouter.post(
  PATH_POST_MODULE_EFFICIENCY,
  validateSchema(moduleEfficiencySchema),
  postModuleEfficiencyController
)

productionRouter.get(
  PATH_GET_MODULE_EFFICIENCY,
  getModuleEfficiencyController
)

productionRouter.get(
  PATH_GET_MODULE_WORKED_MINUTES,
  getModuleWorkedMinutesController
)

productionRouter.post(
  PATH_POST_PROCESS_AUDIT,
  validateSchema(createProcessAuditSchema),
  postProcessAuditController
)

productionRouter.get(PATH_GET_PROCESS_AUDIT, getProcessAuditController)

export default productionRouter
