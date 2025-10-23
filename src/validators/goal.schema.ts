import Joi from 'joi'

const dailyTargetSchema = Joi.object({
  TARGET_DATE: Joi.date().required(),
  TARGET_VALUE: Joi.number().integer().min(0).required(),
  TARGET_TIME: Joi.number().min(0).optional(),
})

export const createGoalSchema = Joi.object({
  MODULE_ID: Joi.number().integer().optional(),
  TARGET_VALUE: Joi.number().integer().optional(),
  DESCRIPTION: Joi.string().required(),
  START_DATE: Joi.date().required(),
  END_DATE: Joi.date().required(),
  WEIGHT: Joi.number().min(0).max(100).required(),
  DAILY_TARGETS: Joi.array().items(dailyTargetSchema).optional(),
  SCOPE: Joi.string()
    .valid('individual', 'module')
    .default('module')
    .optional(),
})

export const updateGoalSchema = Joi.object({
  GOAL_ID: Joi.number().required(),
  MODULE_ID: Joi.number().integer().optional(),
  DESCRIPTION: Joi.string().optional(),
  START_DATE: Joi.date().optional(),
  END_DATE: Joi.date().optional(),
  WEIGHT: Joi.number().min(0).max(100).optional(),
  SCOPE: Joi.string().valid('individual', 'module').optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
  TARGET_VALUE: Joi.number().integer().optional(),
})

export const assignGoalStaffSchema = Joi.object({
  GOAL_ID: Joi.number().integer().required(),
  PERIOD: Joi.number().integer().required(),
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
  DAILY_TARGETS: Joi.array().items(dailyTargetSchema).min(1).required(),
})

export const postProgressSchema = Joi.object({
  GOAL_ID: Joi.number().integer().required(),
  SCOPE: Joi.string().valid('individual', 'module').required(),
  PERIOD: Joi.number().integer().required(),
  ACTUAL_VALUE: Joi.number().integer().min(0).required(),
  ACTUAL_TIME: Joi.number().min(0).optional(),
  STAFF_ID: Joi.number().integer().when('SCOPE', {
    is: 'individual',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  MODULE_ID: Joi.number().integer().when('SCOPE', {
    is: 'module',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  CONTRIBUTIONS: Joi.array()
    .items(
      Joi.object({
        STAFF_ID: Joi.number().integer().required(),
        ACTUAL_VALUE: Joi.number().integer().min(0).required(),
        ACTUAL_TIME: Joi.number().min(0).optional(),
      })
    )
    .when('SCOPE', {
      is: 'module',
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
})
