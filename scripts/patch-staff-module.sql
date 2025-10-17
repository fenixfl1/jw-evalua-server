-- Sincroniza public."STAFF"."MODULE_ID" con la asignación activa en public."STAFF_X_MODULE"
-- Ejecutar dentro de una transacción si se requiere revertir fácilmente.

WITH active_assignments AS (
  SELECT DISTINCT ON (sxm."STAFF_ID")
    sxm."STAFF_ID",
    sxm."MODULE_ID"
  FROM public."STAFF_X_MODULE" sxm
  WHERE sxm."STATE" = 'A'
  ORDER BY
    sxm."STAFF_ID",
    sxm."UPDATED_AT" DESC NULLS LAST,
    sxm."CREATED_AT" DESC
)
UPDATE public."STAFF" s
SET "MODULE_ID" = aa."MODULE_ID"
FROM active_assignments aa
WHERE s."STAFF_ID" = aa."STAFF_ID";

-- Limpia cualquier empleado sin asignaciones activas dejándolo con MODULE_ID = NULL.
UPDATE public."STAFF" s
SET "MODULE_ID" = NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM public."STAFF_X_MODULE" sxm
  WHERE sxm."STAFF_ID" = s."STAFF_ID"
    AND sxm."STATE" = 'A'
);
