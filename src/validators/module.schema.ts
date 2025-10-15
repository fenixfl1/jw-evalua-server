import Joi from 'joi'

export const createModuleSchema = Joi.object({
  DESCRIPTION: Joi.string().required(),
  SUPERVISOR_ID: Joi.number().required(),
  MEMBERS: Joi.array().items(Joi.number()).optional().default([]),
})

export const updateModuleSchema = Joi.object({
  MODULE_ID: Joi.number().required(),
  DESCRIPTION: Joi.string().optional(),
  SUPERVISOR_ID: Joi.number().optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
})

export const createOrUpdateMembersSchema = Joi.object({
  MODULE_ID: Joi.number().required(),
  MEMBERS: Joi.array().items({
    STAFF_ID: Joi.number().required(),
    STATE: Joi.string().valid('A', 'I').required(),
  }),
})

export const getModuleMembersSchema = Joi.object({
  condition: Joi.object({
    MODULE_ID: Joi.number().required(),
    STATE: Joi.string().valid('A', 'I').optional(),
    STAFF_ID: Joi.number().optional(),
  }),
})
