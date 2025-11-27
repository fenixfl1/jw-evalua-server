import { Request, Response, NextFunction } from 'express'
import { sendResponse } from '@src/helpers/response'
import { ProductionMetricsService } from '../services/production-metrics.service'

const productionMetricsService = new ProductionMetricsService()

export const postModuleEfficiencyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await productionMetricsService.recordEfficiency(
      req.body,
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getModuleEfficiencyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = Number(req.params.moduleId)
    const period =
      typeof req.query.period === 'string' ? Number(req.query.period) : undefined
    const result = await productionMetricsService.getEfficiency(
      moduleId,
      Number.isFinite(period) ? period : undefined
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getModuleWorkedMinutesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = Number(req.params.moduleId)
    const period =
      typeof req.query.period === 'string' ? Number(req.query.period) : undefined

    const result = await productionMetricsService.getModuleWorkedMinutes(
      moduleId,
      Number.isFinite(period) ? period : undefined
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const postProcessAuditController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await productionMetricsService.createProcessAudit(
      req.body,
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getProcessAuditController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleIdParam = req.query.moduleId
    const moduleId =
      typeof moduleIdParam === 'string' && moduleIdParam.trim() !== ''
        ? Number(moduleIdParam)
        : undefined
    const { startDate, endDate } = req.query as {
      startDate?: string
      endDate?: string
    }
    const result = await productionMetricsService.getProcessAudits(
      moduleId,
      { startDate, endDate }
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
