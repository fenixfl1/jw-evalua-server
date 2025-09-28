import { NextFunction, Request, Response } from 'express'
import { DashboardService } from '../services/dashboard.service'
import { sendResponse } from '@src/helpers/response'

type DashboardAction = 'INSERT' | 'UPDATE' | 'DELETE'

type QueryValue = string | string[] | undefined | number | Date

const dashboardService = new DashboardService()

const parseNumberParam = (value: QueryValue): number | undefined => {
  if (value === undefined) return undefined
  if (value instanceof Date) return undefined
  if (Array.isArray(value)) return Number(value[0])

  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const parseDateParam = (value: QueryValue): Date | undefined => {
  if (value === undefined) return undefined
  if (value instanceof Date) return value
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = new Date(String(raw))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const parseStringParam = (value: QueryValue): string | undefined => {
  if (value === undefined) return undefined
  const raw = Array.isArray(value) ? value[0] : String(value)
  return raw.trim() ? raw.trim() : undefined
}

export const getDashboardSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      moduleId: parseNumberParam(req.query.moduleId as QueryValue),
      periodStart: parseNumberParam(req.query.periodStart as QueryValue),
      periodEnd: parseNumberParam(req.query.periodEnd as QueryValue),
    }

    const result = await dashboardService.getSummary(filters)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getDashboardActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseNumberParam(req.query.limit as QueryValue) ?? 20
    const offset = parseNumberParam(req.query.offset as QueryValue) ?? 0
    const actionValue = parseStringParam(req.query.action as QueryValue)

    const filters = {
      limit,
      offset,
      action: actionValue as DashboardAction | undefined,
      model: parseStringParam(req.query.model as QueryValue),
      userId: parseNumberParam(req.query.userId as QueryValue),
      dateFrom: parseDateParam(req.query.dateFrom as QueryValue),
      dateTo: parseDateParam(req.query.dateTo as QueryValue),
    }

    const result = await dashboardService.getActivityLog(filters)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
