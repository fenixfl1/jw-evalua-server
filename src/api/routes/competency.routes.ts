import { Router } from 'express'
import { PATH_GET_COMPETENCIES } from '@src/constants/routes'
import { getCompetenciesController } from '../controllers/competency.controller'

const competencyRouter = Router()

competencyRouter.get(PATH_GET_COMPETENCIES, getCompetenciesController)

export default competencyRouter
