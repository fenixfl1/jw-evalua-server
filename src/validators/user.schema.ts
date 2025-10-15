import Joi from 'joi'

export const createUserSchema = Joi.object({
  PASSWORD: Joi.string().optional(),
  AVATAR: Joi.string().allow(null).optional(),
  STAFF_ID: Joi.number().required(),
  ROLE_ID: Joi.number().required(),
  USERNAME: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'USERNAME solo puede contener letras, números y guion bajo (_), sin caracteres especiales ni espacios.',
    }),
})

export const updateUseSchema = Joi.object({
  USER_ID: Joi.number().required(),
  AVATAR: Joi.string().allow(null).optional(),
  ROLE_ID: Joi.number().optional(),
  STATE: Joi.string().valid('A', 'I').optional(),
  USERNAME: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'USERNAME solo puede contener letras, números y guion bajo (_), sin caracteres especiales ni espacios.',
    }),
})

export const changePasswordSchema = Joi.object({
  NEW_PASSWORD: Joi.string().required(),
  OLD_PASSWORD: Joi.string().required(),
  USERNAME: Joi.string().required(),
})
