import Joi from 'joi'

export const moduleEfficiencySchema = Joi.object({
  MODULE_ID: Joi.number().integer().positive().required(),
  PERIOD: Joi.number().integer().positive().required(),
  TOTAL_UNITS: Joi.number().positive().required(),
  SAM: Joi.number().positive().required(),
  MINUTES_WORKED: Joi.number().positive().required(),
  NOTES: Joi.string().max(255).allow('', null),
})

const defectSchema = Joi.object({
  type: Joi.string().max(120).required(),
  count: Joi.number().integer().min(0).required(),
})

export const createProcessAuditSchema = Joi.object({
  MODULE_ID: Joi.number().integer().positive().required(),
  AUDIT_DATE: Joi.string().required(),
  SHIFT: Joi.string().max(50).allow('', null),
  STYLE: Joi.number(),
  SUPERVISOR: Joi.number().required(),
  AUDITOR: Joi.number().required(),
  COMMENTS: Joi.string().max(255).allow('', null),
  ENTRIES: Joi.array()
    .items(
      Joi.object({
        operation: Joi.number(),
        operator: Joi.number(),
        timeSlot: Joi.string().max(60).allow('', null),
        samples: Joi.number().integer().min(0).allow(null),
        defects: Joi.array().items(defectSchema).default([]),
        comments: Joi.string().max(250).allow('', null),
      })
    )
    .min(1)
    .required(),
})
