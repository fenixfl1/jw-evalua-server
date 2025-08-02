import Joi from 'joi'

export const createUserSchema = Joi.object({
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().optional(),
  AVATAR: Joi.string().allow(null).optional(),
  STAFF_ID: Joi.number().required(),
  ROLE_ID: Joi.number().required(),
})
