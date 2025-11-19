import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import authRouter from './auth.routes'
import staffRouter from './staff.routes'
import userRouter from './user.routes'
import menuOptionRouter from './menu-option.routes'
import roleRouter from './role.routes'
import permissionRouter from './permission.routes'
import moduleRouter from './module.routes'
import goalRouter from './goal.routes'
import evaluationRouter from './evaluation.routes'
import competencyRouter from './competency.routes'
import dashboardRouter from './dashboard.routes'
import operatorRouter from './operator.routes'
import productionRouter from './production.routes'

const publicRoutes: Router[] = [authRouter]
const privateRoutes: Router[] = [
  staffRouter,
  userRouter,
  menuOptionRouter,
  roleRouter,
  permissionRouter,
  moduleRouter,
  goalRouter,
  competencyRouter,
  evaluationRouter,
  dashboardRouter,
  operatorRouter,
  productionRouter,
]

const publicRouter = Router()
const privateRouter = Router()
const mainRouter = Router()

privateRouter.use(authMiddleware)

publicRouter.use(publicRoutes)
privateRouter.use(privateRoutes)

mainRouter.use([publicRouter, privateRouter])

export default mainRouter
