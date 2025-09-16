import Joi from 'joi'

export const createGoalSchema = Joi.object({
  MODULE_ID: Joi.number().integer().optional(),
  DESCRIPTION: Joi.string().required(),
  START_DATE: Joi.date().required(),
  END_DATE: Joi.date().required(),
  WEIGHT: Joi.number().min(0).max(100).required(),
  SCOPE: Joi.string().valid('individual', 'module').required(),
})

export const assignGoalStaffSchema = Joi.object({
  GOAL_ID: Joi.number().integer().required(),
  PERIOD: Joi.number().integer().required(), // ISO week YYYYWW
  ASSIGNMENTS: Joi.array()
    .items(
      Joi.object({
        STAFF_ID: Joi.number().integer().required(),
        TARGET_VALUE: Joi.number().integer().min(0).required(),
        WEIGHT: Joi.number().min(0).max(100).optional(),
      })
    )
    .min(1)
    .required(),
})

export const assignGoalModuleSchema = Joi.object({
  GOAL_ID: Joi.number().integer().required(),
  MODULE_ID: Joi.number().integer().required(),
  PERIOD: Joi.number().integer().required(),
  TARGET_VALUE: Joi.number().integer().min(0).required(),
})

export const postProgressSchema = Joi.object({
  GOAL_ID: Joi.number().integer().required(),
  SCOPE: Joi.string().valid('individual', 'module').required(),
  PERIOD: Joi.number().integer().required(),
  ACTUAL_VALUE: Joi.number().integer().min(0).required(),
  STAFF_ID: Joi.number().integer().when('SCOPE', {
    is: 'individual',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  MODULE_ID: Joi.number().integer().when('SCOPE', {
    is: 'module',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
})
