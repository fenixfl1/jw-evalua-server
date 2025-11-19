DO $$
DECLARE
  v_role_id CONSTANT integer := 4;
  v_staff_id integer;
  v_user_id integer;
BEGIN
  -- Crea el empleado
  INSERT INTO "STAFF" (
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
  VALUES (
    'María',
    'Quintana',
    'maria.quintana@example.com',
    DATE '1992-03-12',
    '8295550012',
    'F',
    '40211856789',
    'Calle Duarte #23, Santo Domingo',
    'A'
  )
  RETURNING "STAFF_ID" INTO v_staff_id;

  -- Crea el usuario
  INSERT INTO "USERS" (
    "STAFF_ID",
    "USERNAME",
    "PASSWORD_HASH",
    "IS_ACTIVE",
    "STATE"
  )
  VALUES (
    v_staff_id,
    'mquintana',
    '$2b$10$2tsxN6FN6Lb9Kr7YRJkZ9..PG8h.XUQWiFXSHN4AO4fo5vFs0cbXK', -- Operador123
    TRUE,
    'A'
  )
  RETURNING "USER_ID" INTO v_user_id;

  -- Asigna el rol 4 al usuario
  INSERT INTO "ROLES_X_USER" (
    "USER_ID",
    "ROLE_ID",
    "CREATED_AT",
    "CREATED_BY",
    "STATE"
  )
  VALUES (
    v_user_id,
    v_role_id,
    NOW(),
    1,
    'A'
  );
END
$$;
