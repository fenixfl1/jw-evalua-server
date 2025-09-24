import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '@src/helpers/response'
import { EvaluationService } from '../services/evaluation.service'
import { extractPagination } from '@src/helpers/extract-pagination'

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
