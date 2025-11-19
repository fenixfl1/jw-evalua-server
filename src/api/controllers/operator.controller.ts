import { Request, Response, NextFunction } from 'express'
import { sendResponse } from '@src/helpers/response'
import { OperatorService } from '../services/operator.service'

const operatorService = new OperatorService()

export const getOperatorDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, period } = req.query
    const parsedPeriod =
      typeof period === 'string' && period.trim() ? Number(period) : undefined
    const result = await operatorService.getDashboard(
      {
        date: typeof date === 'string' ? date : undefined,
        period:
          typeof parsedPeriod === 'number' && Number.isFinite(parsedPeriod)
            ? parsedPeriod
            : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const postOperatorCompletionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.registerCompletion(
      taskId,
      {
        timestamp:
          typeof req.body?.timestamp === 'string'
            ? req.body.timestamp
            : undefined,
        units: typeof req.body?.units === 'number' ? req.body.units : undefined,
        staffIdOverride:
          typeof req.body?.staffId === 'number' ? req.body.staffId : undefined,
        metadata:
          req.body?.metadata && typeof req.body.metadata === 'object'
            ? (req.body.metadata as Record<string, unknown>)
            : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error })
    next(error)
  }
}

export const resetOperatorTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.resetTask(
      taskId,
      {
        date: typeof req.query?.date === 'string' ? req.query.date : undefined,
      },
      req['sessionInfo']
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const startOperatorSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.startSession(
      taskId,
      {
        timestamp:
          typeof req.body?.timestamp === 'string' ? req.body.timestamp : undefined,
        staffIdOverride:
          typeof req.body?.staffId === 'number' ? req.body.staffId : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const pauseOperatorSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.pauseSession(
      taskId,
      {
        timestamp:
          typeof req.body?.timestamp === 'string' ? req.body.timestamp : undefined,
        staffIdOverride:
          typeof req.body?.staffId === 'number' ? req.body.staffId : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const resumeOperatorSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.resumeSession(
      taskId,
      {
        timestamp:
          typeof req.body?.timestamp === 'string' ? req.body.timestamp : undefined,
        staffIdOverride:
          typeof req.body?.staffId === 'number' ? req.body.staffId : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const stopOperatorSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.taskId)
    const result = await operatorService.stopSession(
      taskId,
      {
        timestamp:
          typeof req.body?.timestamp === 'string' ? req.body.timestamp : undefined,
        staffIdOverride:
          typeof req.body?.staffId === 'number' ? req.body.staffId : undefined,
      },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
