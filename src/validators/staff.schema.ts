import Joi from 'joi'

export const createStaffSchema = Joi.object({
  NAME: Joi.string().required(),
  LAST_NAME: Joi.string().required(),
  EMAIL: Joi.string().email().required(),
  BIRTH_DATE: Joi.date().required(),
  PHONE: Joi.string().required(),
  GENDER: Joi.string().valid('M', 'F').required(),
  IDENTITY_DOCUMENT: Joi.string().length(11).required(),
  ADDRESS: Joi.string().optional().allow('', null),
  CREATED_AT: Joi.date().optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
})

export const updateStaffSchema = Joi.object({
  NAME: Joi.string().optional(),
  LAST_NAME: Joi.string().optional(),
  EMAIL: Joi.string().email().optional(),
  BIRTH_DATE: Joi.date().optional(),
  PHONE: Joi.string().optional(),
  GENDER: Joi.string().valid('M', 'F').optional(),
  IDENTITY_DOCUMENT: Joi.string().length(11).optional(),
  ADDRESS: Joi.string().optional().allow('', null),
  CREATED_AT: Joi.date().optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
  STAFF_ID: Joi.number().required(),
})
