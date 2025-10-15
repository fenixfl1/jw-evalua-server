import { Request, Response, NextFunction } from 'express'
import { sendResponse } from '@src/helpers/response'
import { UserService } from '../services/user.service'
import { extractPagination } from '@src/helpers/extract-pagination'

const userService = new UserService()

export const createUserController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.create(
      request.body,
      request['sessionInfo']
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateUserController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.update(
      request.body,
      request['sessionInfo']
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const changeUserController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.changePassword(request.body)

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getUserPaginationController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.getPagination(
      request.body,
      extractPagination(request.query)
    )

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getUerController = async (
  request: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = request.params
    const result = await userService.getOneUer(username)

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
