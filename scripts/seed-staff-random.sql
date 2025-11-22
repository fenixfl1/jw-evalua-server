-- Inserta 50 empleados con datos pseudoaleatorios para pruebas locales.
WITH first_names AS (
  SELECT ARRAY[
      'Laura','Miguel','Daniela','Oscar','Camila',
      'Andres','Sofia','Rafael','Valentina','Hector',
      'Ana','Carlos','Elena','Jorge','Lucia',
      'Pedro','Mariana','Diego','Natalia','Felipe'
    ] AS names
),
last_names AS (
  SELECT ARRAY[
      'Gomez','Ramirez','Lopez','Torres','Fernandez',
      'Martinez','Herrera','Nunez','Paredes','Santos',
      'Vargas','Jimenez','Castillo','Reyes','Rojas',
      'Alvarez','Cabrera','Mendez','Silva','Delgado'
    ] AS names
),
streets AS (
  SELECT ARRAY[
      'Calle 27 de Febrero 120, Santo Domingo',
      'Av. Maximo Gomez 45, Santo Domingo',
      'Calle Duarte 233, Santiago',
      'Carretera Mella Km 8, Santo Domingo Este',
      'Residencial Los Laureles, La Vega',
      'Urbanizacion Real, San Cristobal',
      'Colinas del Norte, Santo Domingo Norte',
      'Residencial Las Carmelitas, Santo Domingo Oeste',
      'Calle Libertad 56, San Pedro de Macoris',
      'Av. Anacaona 101, Santo Domingo',
      'Calle El Sol 89, Santiago',
      'Calle Las Flores 12, La Romana',
      'Av. Abraham Lincoln 450, Santo Domingo',
      'Calle Restauracion 78, Puerto Plata',
      'Av. Venezuela 300, Santo Domingo Este'
    ] AS addrs
),
area_codes AS (SELECT ARRAY['809','829','849'] AS codes),
genders AS (SELECT ARRAY['M','F','O'] AS values),
base_rows AS (
  SELECT
    gs,
    (SELECT names[1 + floor(random() * array_length(names, 1))::int] FROM first_names) AS name,
    (SELECT names[1 + floor(random() * array_length(names, 1))::int] FROM last_names) AS last_name,
    (SELECT addrs[1 + floor(random() * array_length(addrs, 1))::int] FROM streets) AS address,
    (SELECT codes[1 + floor(random() * array_length(codes, 1))::int] FROM area_codes) AS area_code,
    (SELECT values[1 + floor(random() * array_length(values, 1))::int] FROM genders) AS gender
  FROM generate_series(1, 50) AS gs
)
INSERT INTO public."STAFF" (
  "NAME",
  "LAST_NAME",
  "EMAIL",
  "BIRTH_DATE",
  "PHONE",
  "GENDER",
  "IDENTITY_DOCUMENT",
  "ADDRESS",
  "STATE"
)
SELECT
  name,
  last_name,
  lower(
    concat(
      regexp_replace(name, '\\s+', '', 'g'),
      '.',
      regexp_replace(last_name, '\\s+', '', 'g'),
      '.',
      lpad(gs::text, 2, '0'),
      '@seed.example.com'
    )
  ) AS email,
  (DATE '1980-01-01' + (floor(random() * 8000))::int) AS birth_date,
  concat(area_code, lpad((floor(random() * 9000000) + 1000000)::text, 7, '0')) AS phone,
  gender,
  lpad((30000000000 + gs)::text, 11, '0') AS identity_document,
  address,
  'A' AS state
FROM base_rows
ON CONFLICT ("EMAIL") DO NOTHING;
