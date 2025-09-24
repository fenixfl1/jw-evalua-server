import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  PATH_CREATE_EVALUATION,
  PATH_UPDATE_EVALUATION,
  PATH_GET_EVALUATION,
  PATH_GET_EVALUATION_PAGINATION,
} from '@src/constants/routes'
import {
  createEvaluationSchema,
  updateEvaluationSchema,
} from '@src/validators/evaluation.schema'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'
import {
  createEvaluationController,
  updateEvaluationController,
  getEvaluationController,
  getEvaluationPaginationController,
} from '../controllers/evaluation.controller'

const evaluationRouter = Router()

evaluationRouter.post(
  PATH_CREATE_EVALUATION,
  validateSchema(createEvaluationSchema),
  createEvaluationController
)

evaluationRouter.put(
  PATH_UPDATE_EVALUATION,
  validateSchema(updateEvaluationSchema),
  updateEvaluationController
)

evaluationRouter.get(PATH_GET_EVALUATION, getEvaluationController)

evaluationRouter.post(
  PATH_GET_EVALUATION_PAGINATION,
  validateSchema(advancedConditionSchema),
  getEvaluationPaginationController
)

export default evaluationRouter
