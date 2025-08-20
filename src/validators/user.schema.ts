import Joi from 'joi'

export const createUserSchema = Joi.object({
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().optional(),
  AVATAR: Joi.string().allow(null).optional(),
  STAFF_ID: Joi.number().required(),
  ROLE_ID: Joi.number().required(),
})

export const updateUseSchema = Joi.object({
  USER_ID: Joi.number().required(),
  USERNAME: Joi.string().required(),
  AVATAR: Joi.string().allow(null).optional(),
  ROLE_ID: Joi.number().optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
})

export const changePasswordSchema = Joi.object({
  NEW_PASSWORD: Joi.string().required(),
  OLD_PASSWORD: Joi.string().required(),
  USERNAME: Joi.string().required(),
})
