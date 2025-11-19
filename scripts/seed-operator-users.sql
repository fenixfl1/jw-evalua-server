-- Crea usuarios para todos los empleados sin cuenta y les asigna el rol 3
DO $$
DECLARE
  staff_record RECORD;
  normalized_first TEXT;
  normalized_last TEXT;
  base_username TEXT;
  candidate_username TEXT;
  suffix INTEGER;
  existing_count INTEGER;
  new_user_id INTEGER;
  created_count INTEGER := 0;
  default_password_hash CONSTANT TEXT := '$2b$10$2tsxN6FN6Lb9Kr7YRJkZ9..PG8h.XUQWiFXSHN4AO4fo5vFs0cbXK'; -- "Operador123"
BEGIN
  FOR staff_record IN
    SELECT s."STAFF_ID", s."NAME", s."LAST_NAME"
    FROM public."STAFF" s
    LEFT JOIN public."USERS" u ON u."STAFF_ID" = s."STAFF_ID"
    WHERE u."STAFF_ID" IS NULL
      AND s."STATE" = 'A'
  LOOP
    normalized_first := regexp_replace(
      translate(lower(COALESCE(staff_record."NAME", '')), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
      '[^a-z]',
      '',
      'g'
    );

    normalized_last := regexp_replace(
      translate(lower(COALESCE(staff_record."LAST_NAME", '')), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
      '[^a-z]',
      '',
      'g'
    );

    base_username := concat(
      COALESCE(left(normalized_first, 1), ''),
      COALESCE(normalized_last, '')
    );

    IF base_username = '' THEN
      base_username := concat('operador', staff_record."STAFF_ID");
    END IF;

    candidate_username := base_username;
    suffix := 1;

    LOOP
      SELECT COUNT(*) INTO existing_count
      FROM public."USERS"
      WHERE lower("USERNAME") = candidate_username;

      EXIT WHEN existing_count = 0;

      candidate_username := base_username || lpad(suffix::text, 2, '0');
      suffix := suffix + 1;
    END LOOP;

    INSERT INTO public."USERS" (
      "STAFF_ID",
      "USERNAME",
      "PASSWORD_HASH",
      "IS_ACTIVE",
      "STATE"
    )
    VALUES (
      staff_record."STAFF_ID",
      candidate_username,
      default_password_hash,
      TRUE,
      'A'
    )
    RETURNING "USER_ID"
    INTO new_user_id;

    INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID")
    SELECT new_user_id, 3
    WHERE NOT EXISTS (
      SELECT 1
      FROM public."ROLES_X_USER"
      WHERE "USER_ID" = new_user_id
        AND "ROLE_ID" = 3
    );

    created_count := created_count + 1;
    RAISE NOTICE 'Usuario % creado para STAFF_ID %', candidate_username, staff_record."STAFF_ID";
  END LOOP;

  RAISE NOTICE 'Total de usuarios creados: %', created_count;
END
$$;
