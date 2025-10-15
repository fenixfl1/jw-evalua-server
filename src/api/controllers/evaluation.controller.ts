import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '@src/helpers/response'
import { EvaluationService } from '../services/evaluation.service'
import { extractPagination } from '@src/helpers/extract-pagination'
import { HTTP_STATUS_BAD_REQUEST } from '@src/constants/status-codes'

const evaluationService = new EvaluationService()

export const createEvaluationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await evaluationService.create(req.body, req['sessionInfo'])
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateEvaluationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const evaluationId = Number(req.params.evaluationId)
    const result = await evaluationService.update(
      evaluationId,
      req.body,
      req['sessionInfo']
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getEvaluationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const evaluationId = Number(req.params.evaluationId)
    const result = await evaluationService.getEvaluation(evaluationId)
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getEvaluationPaginationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await evaluationService.getEvaluationsPagination(
      req.body,
      extractPagination(req.query)
    )
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const checkEvaluationAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      staffId,
      period,
      excludeEvaluationId = '202541',
    } = req.query as {
      staffId: string | number
      period: string | number
      excludeEvaluationId?: string | number
    }

    const parsedStaffId =
      typeof staffId === 'number' ? staffId : Number(staffId)
    const parsedPeriod = typeof period === 'number' ? period : Number(period)
    const parsedExcludeEvaluationId =
      excludeEvaluationId === undefined
        ? undefined
        : typeof excludeEvaluationId === 'number'
        ? excludeEvaluationId
        : Number(excludeEvaluationId)

    if (Number.isNaN(parsedStaffId)) {
      return sendResponse(res, {
        status: HTTP_STATUS_BAD_REQUEST,
        message: 'Parametro "staffId" invalido.',
      })
    }

    if (Number.isNaN(parsedPeriod)) {
      return sendResponse(res, {
        status: HTTP_STATUS_BAD_REQUEST,
        message: 'Parametro "period" invalido.',
      })
    }

    if (
      parsedExcludeEvaluationId !== undefined &&
      Number.isNaN(parsedExcludeEvaluationId)
    ) {
      return sendResponse(res, {
        status: HTTP_STATUS_BAD_REQUEST,
        message: 'Parametro "excludeEvaluationId" invalido.',
      })
    }

    const result = await evaluationService.checkAvailability({
      staffId: parsedStaffId,
      period: parsedPeriod,
      excludeEvaluationId: parsedExcludeEvaluationId,
    })

    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
