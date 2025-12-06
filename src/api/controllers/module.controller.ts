import { NextFunction, Request, Response } from 'express'
import { ModuleService } from '../services/module.service'
import { sendResponse } from '@src/helpers/response'
import { extractPagination } from '@src/helpers/extract-pagination'

const moduleService = new ModuleService()

export const createModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.create(req.body, req['sessionInfo'])

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.update(req.body, req['sessionInfo'])

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getPaginatedModulesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.get_pagination(
      req.body,
      extractPagination(req.query)
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const createOrUpdateMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.createOrUpdateMembers(
      req.body,
      req['sessionInfo']
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getModuleMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.getModuleMembers(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getModuleGoalsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.getModuleGoals(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getMemberTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await moduleService.getMemberTasks(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
