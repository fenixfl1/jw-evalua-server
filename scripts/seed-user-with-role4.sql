DO $$
DECLARE
  v_role_id CONSTANT integer := 4;
  v_staff_id integer;
  v_user_id integer;
  v_staff_email CONSTANT text := 'maria.quintana@example.com';
  v_staff_identity CONSTANT text := '40211856789';
  v_username CONSTANT text := 'mquintana';
BEGIN
  -- Evita ejecutar el script si ya existen registros que provocarían conflictos
  IF EXISTS (
    SELECT 1
    FROM "STAFF"
    WHERE "EMAIL" = v_staff_email
      OR "IDENTITY_DOCUMENT" = v_staff_identity
  ) OR EXISTS (
    SELECT 1
    FROM "USERS"
    WHERE "USERNAME" = v_username
  ) THEN
    RAISE NOTICE 'Conflicto detectado: el empleado o usuario ya existe. No se realizaron cambios.';
    RETURN;
  END IF;

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
      v_staff_email,
      DATE '1992-03-12',
      '8295550012',
      'F',
      v_staff_identity,
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
      v_username,
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
  EXCEPTION
    WHEN unique_violation OR exclusion_violation OR foreign_key_violation OR check_violation THEN
      RAISE NOTICE 'Conflicto detectado durante la inserción. No se realizaron cambios: %', SQLERRM;
    WHEN others THEN
      RAISE NOTICE 'Error inesperado durante la inserción. No se realizaron cambios: %', SQLERRM;
  END;
END
$$;
