import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '@src/helpers/response'
import { GoalService } from '../services/goal.service'
import { extractPagination } from '@src/helpers/extract-pagination'

const goalService = new GoalService()

export const createGoalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await goalService.create(req.body, req['sessionInfo'])
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const assignGoalStaffController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await goalService.assignToStaff(req.body, req['sessionInfo'])
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const assignGoalModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await goalService.assignToModule(
      req.body,
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const postGoalProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await goalService.postProgress(req.body, req['sessionInfo'])
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getGoalSummaryStaffController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staffId = Number(req.params.staffId)
    const periodId = Number(req.params.periodId)
    const result = await goalService.getStaffSummary(
      { STAFF_ID: staffId, PERIOD: periodId },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getGoalSummaryModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = Number(req.params.moduleId)
    const periodId = Number(req.params.periodId)
    const result = await goalService.getModuleSummary(
      { MODULE_ID: moduleId, PERIOD: periodId },
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getGoalsByModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId = Number(req.params.moduleId)
    const result = await goalService.getGoalsByModule(moduleId)
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getGoalSummaryModulePaginationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await goalService.getModuleSummaryPagination(
      req.body,
      extractPagination(req.query)
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
