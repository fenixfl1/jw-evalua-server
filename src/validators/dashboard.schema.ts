import Joi from 'joi'

const periodSchema = Joi.number()
  .integer()
  .min(190001)
  .max(299953)
  .messages({
    'number.base': 'El periodo debe ser numerico (formato YYYYWW).',
    'number.min': 'El periodo debe ser igual o mayor que 190001.',
    'number.max': 'El periodo debe ser igual o menor que 299953.',
    'number.integer': 'El periodo debe ser numerico (formato YYYYWW).',
  })

export const dashboardSummaryQuerySchema = Joi.object({
  moduleId: Joi.number().integer().positive().optional(),
  periodStart: periodSchema.optional(),
  periodEnd: periodSchema.optional(),
})
  .custom((value, helpers) => {
    const { periodStart, periodEnd } = value

    if (
      periodStart !== undefined &&
      periodEnd !== undefined &&
      periodStart > periodEnd
    ) {
      return helpers.error('any.invalid')
    }

    return value
  }, 'Periodo start/end validation')
  .messages({
    'any.invalid': 'El periodo inicial no puede ser mayor que el periodo final.',
  })

export const dashboardActivityQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  action: Joi.string().valid('INSERT', 'UPDATE', 'DELETE').optional(),
  model: Joi.string().max(150).optional(),
  userId: Joi.number().integer().positive().optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
})
  .custom((value, helpers) => {
    const { dateFrom, dateTo } = value

    if (dateFrom && dateTo && dateFrom > dateTo) {
      return helpers.error('any.invalid')
    }

    return value
  }, 'Date range validation')
  .messages({
    'any.invalid': 'La fecha inicial no puede ser mayor que la fecha final.',
  })
