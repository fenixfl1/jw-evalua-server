import { NextFunction, Request, Response } from 'express'
import { StaffService } from '../services/staff.service'
import { sendResponse } from '@src/helpers/response'
import { extractPagination } from '@src/helpers/extract-pagination'

const staffService = new StaffService()

export const createStaffController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await staffService.create(
      request.body,
      request['sessionInfo']
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getPaginationController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await staffService.getPagination(
      request.body,
      extractPagination(request.query)
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
