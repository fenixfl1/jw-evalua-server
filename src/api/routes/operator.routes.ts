import { Router } from 'express'
import {
  getOperatorDashboardController,
  postOperatorCompletionController,
  resetOperatorTaskController,
  startOperatorSessionController,
  pauseOperatorSessionController,
  resumeOperatorSessionController,
  stopOperatorSessionController,
} from '../controllers/operator.controller'

const operatorRouter = Router()

operatorRouter.get('/operator/dashboard', getOperatorDashboardController)
operatorRouter.post(
  '/operator/tasks/:taskId/completions',
  postOperatorCompletionController
)
operatorRouter.delete(
  '/operator/tasks/:taskId/completions',
  resetOperatorTaskController
)
operatorRouter.post(
  '/operator/tasks/:taskId/session/start',
  startOperatorSessionController
)
operatorRouter.post(
  '/operator/tasks/:taskId/session/pause',
  pauseOperatorSessionController
)
operatorRouter.post(
  '/operator/tasks/:taskId/session/resume',
  resumeOperatorSessionController
)
operatorRouter.post(
  '/operator/tasks/:taskId/session/stop',
  stopOperatorSessionController
)

export default operatorRouter
