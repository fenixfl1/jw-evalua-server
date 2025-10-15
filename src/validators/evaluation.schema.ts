import Joi from 'joi'

const evaluationDetailSchema = Joi.object({
  COMPETENCY_ID: Joi.number().integer().required(),
  GOAL_STAFF_ID: Joi.number().integer().allow(null),
  WEIGHT: Joi.number().min(0).max(100).allow(null),
  SCORE: Joi.number().min(0).max(100).allow(null),
  COMMENT: Joi.string().allow('', null),
})

export const createEvaluationSchema = Joi.object({
  MODULE_ID: Joi.number().integer().required(),
  STAFF_ID: Joi.number().integer().required(),
  EVALUATOR_ID: Joi.number().integer().allow(null),
  PERIOD: Joi.number().integer().required(),
  OVERALL_SCORE: Joi.number().min(0).max(100).allow(null),
  COMMENTS: Joi.string().allow('', null),
  DETAILS: Joi.array().items(evaluationDetailSchema).min(1).required(),
})

export const updateEvaluationSchema = Joi.object({
  MODULE_ID: Joi.number().integer(),
  STAFF_ID: Joi.number().integer(),
  EVALUATOR_ID: Joi.number().integer().allow(null),
  PERIOD: Joi.number().integer(),
  OVERALL_SCORE: Joi.number().min(0).max(100).allow(null),
  COMMENTS: Joi.string().allow('', null),
  STATE: Joi.string().valid('A', 'I'),
  DETAILS: Joi.array().items(
    evaluationDetailSchema.keys({
      EVALUATION_DETAIL_ID: Joi.number().integer(),
      _ACTION: Joi.string().valid('create', 'update', 'delete').default('update'),
    })
  ).optional(),
}).min(1)

export const evaluationAvailabilityQuerySchema = Joi.object({
  staffId: Joi.number().integer().required(),
  period: Joi.number().integer().required(),
  excludeEvaluationId: Joi.number().integer(),
})
