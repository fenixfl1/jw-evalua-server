import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '@src/helpers/response'
import { CompetencyService } from '../services/competency.service'

const competencyService = new CompetencyService()

export const getCompetenciesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await competencyService.getAll()
    return sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
