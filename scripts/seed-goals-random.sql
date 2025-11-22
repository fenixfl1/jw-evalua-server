-- Inserta 20 metas con datos de ejemplo en la tabla GOAL.
-- Evita duplicados por descripcion + scope para que sea reejecutable.
WITH adjectives AS (
  SELECT ARRAY[
    'Incrementar', 'Optimizar', 'Reducir', 'Acelerar', 'Mejorar',
    'Expandir', 'Fortalecer', 'Consolidar', 'Impulsar', 'Elevar'
  ] AS items
),
themes AS (
  SELECT ARRAY[
    'Productividad', 'Calidad', 'Satisfaccion', 'Eficiencia', 'Tiempo de ciclo',
    'Capacitacion', 'Innovacion', 'Entrega', 'Disponibilidad', 'Cumplimiento'
  ] AS items
),
base AS (
  SELECT
    gs,
    (SELECT items[1 + floor(random() * array_length(items, 1))::int] FROM adjectives) AS adj,
    (SELECT items[1 + floor(random() * array_length(items, 1))::int] FROM themes) AS theme,
    CASE WHEN gs % 2 = 0 THEN 'module' ELSE 'individual' END AS scope,
    (CURRENT_DATE - (15 + floor(random() * 45))::int) AS start_date,
    (50 + floor(random() * 150))::numeric AS target_value,
    (5 + (gs % 6) * 5) AS weight
  FROM generate_series(1, 20) AS gs
),
payload AS (
  SELECT
    concat(adj, ' ', theme, ' ', lpad(gs::text, 2, '0')) AS description,
    start_date,
    start_date + (20 + floor(random() * 60))::int AS end_date,
    target_value,
    weight,
    scope
  FROM base
)
INSERT INTO public."GOAL" (
  "DESCRIPTION",
  "START_DATE",
  "END_DATE",
  "TARGET_VALUE",
  "WEIGHT",
  "SCOPE",
  "STATE"
)
SELECT
  description,
  start_date,
  end_date,
  target_value,
  weight,
  scope,
  'A' AS state
FROM payload p
WHERE NOT EXISTS (
  SELECT 1
  FROM public."GOAL" g
  WHERE g."DESCRIPTION" = p.description
    AND g."SCOPE" = p.scope
);
