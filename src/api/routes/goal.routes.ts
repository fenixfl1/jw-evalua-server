import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  PATH_ASSIGN_GOAL_MODULE,
  PATH_ASSIGN_GOAL_STAFF,
  PATH_CREATE_GOAL,
  PATH_GET_GOAL_SUMMARY_MODULE,
  PATH_GET_GOAL_SUMMARY_MODULE_PAGINATION,
  PATH_GET_GOAL_SUMMARY_STAFF,
  PATH_POST_GOAL_PROGRESS,
  PATH_GET_GOALS_BY_MODULE,
  PATH_GET_GOAL_PAGINATION,
  PATH_GET_GOAL_MODULE_TASKS,
} from '@src/constants/routes'
import {
  assignGoalModuleSchema,
  assignGoalStaffSchema,
  createGoalSchema,
  postProgressSchema,
  updateGoalSchema,
} from '@src/validators/goal.schema'
import { advancedConditionSchema } from '@src/validators/advanced-condition.schema'
import {
  assignGoalModuleController,
  assignGoalStaffController,
  createGoalController,
  getGoalSummaryModuleController,
  getGoalSummaryModulePaginationController,
  getGoalSummaryStaffController,
  postGoalProgressController,
  getGoalsByModuleController,
  getGoalsPaginationController,
  updateController,
  getGoalModuleTasksController,
} from '../controllers/goal.controller'

const goalRouter = Router()

goalRouter
  .route(PATH_CREATE_GOAL)
  .post(validateSchema(createGoalSchema), createGoalController)
  .put(validateSchema(updateGoalSchema), updateController)

goalRouter.post(
  PATH_ASSIGN_GOAL_STAFF,
  validateSchema(assignGoalStaffSchema),
  assignGoalStaffController
)

goalRouter.post(
  PATH_ASSIGN_GOAL_MODULE,
  validateSchema(assignGoalModuleSchema),
  assignGoalModuleController
)

goalRouter.post(
  PATH_POST_GOAL_PROGRESS,
  validateSchema(postProgressSchema),
  postGoalProgressController
)

goalRouter.get(PATH_GET_GOAL_SUMMARY_STAFF, getGoalSummaryStaffController)
goalRouter.get(PATH_GET_GOAL_SUMMARY_MODULE, getGoalSummaryModuleController)

goalRouter.post(
  PATH_GET_GOAL_SUMMARY_MODULE_PAGINATION,
  validateSchema(advancedConditionSchema),
  getGoalSummaryModulePaginationController
)

goalRouter.post(
  PATH_GET_GOAL_PAGINATION,
  validateSchema(advancedConditionSchema),
  getGoalsPaginationController
)

goalRouter.get(PATH_GET_GOAL_MODULE_TASKS, getGoalModuleTasksController)
goalRouter.get(PATH_GET_GOALS_BY_MODULE, getGoalsByModuleController)

export default goalRouter
