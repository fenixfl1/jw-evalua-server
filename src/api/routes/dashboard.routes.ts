import { Router } from 'express'
import { validateSchema } from '../middlewares/validator-middleware'
import {
  dashboardActivityQuerySchema,
  dashboardSummaryQuerySchema,
} from '@src/validators/dashboard.schema'
import {
  getDashboardActivityController,
  getDashboardSummaryController,
} from '../controllers/dashboard.controller'
import {
  PATH_GET_DASHBOARD_ACTIVITY,
  PATH_GET_DASHBOARD_SUMMARY,
} from '@src/constants/routes'

const dashboardRouter = Router()

dashboardRouter.get(
  PATH_GET_DASHBOARD_SUMMARY,
  // validateSchema(dashboardSummaryQuerySchema, 'query'),
  getDashboardSummaryController
)

dashboardRouter.get(
  PATH_GET_DASHBOARD_ACTIVITY,
  // validateSchema(dashboardActivityQuerySchema, 'query'),
  getDashboardActivityController
)

export default dashboardRouter
