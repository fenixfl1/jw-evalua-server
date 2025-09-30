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

export const updateStaffController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await staffService.update(
      request.body,
      request['sessionInfo']
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getOneStaffController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { staffId } = request.params
    const result = await staffService.getOneStaff(Number(staffId))

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const validateIdentityDocumentController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identityDocument } = request.query as { identityDocument?: string | string[] }
    const value = Array.isArray(identityDocument)
      ? identityDocument[0] ?? ''
      : identityDocument ?? ''
    const result = await staffService.validateIdentityDocument(value)

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
