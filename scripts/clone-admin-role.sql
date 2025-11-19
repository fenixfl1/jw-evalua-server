DO $$
DECLARE
  v_source_role CONSTANT integer := 1;
  v_target_role CONSTANT integer := 4;
  v_target_name CONSTANT text := 'Auditor';
  v_target_description CONSTANT text := 'Rol clonado de Administrador';
BEGIN
  -- Limpia referencias previas del rol destino
  DELETE FROM "MENU_OPTIONS_X_ROLES" WHERE "ROLE_ID" = v_target_role;
  DELETE FROM "PERMISSION_X_ROLE" WHERE "ROLE_ID" = v_target_role;
  DELETE FROM "ROLE" WHERE "ROLE_ID" = v_target_role;

  -- Crea el nuevo rol copiando datos base del rol administrador (ID = 1)
  INSERT INTO "ROLE" (
    "ROLE_ID",
    "NAME",
    "DESCRIPTION",
    "CREATED_AT",
    "CREATED_BY",
    "STATE"
  )
  SELECT
    v_target_role,
    v_target_name,
    v_target_description,
    NOW(),
    "CREATED_BY",
    "STATE"
  FROM "ROLE"
  WHERE "ROLE_ID" = v_source_role;

  -- Replica las relaciones con permisos
  INSERT INTO "PERMISSION_X_ROLE" (
    "PERMISSION_ID",
    "ROLE_ID",
    "CREATED_AT",
    "CREATED_BY",
    "STATE"
  )
  SELECT
    pr."PERMISSION_ID",
    v_target_role,
    NOW(),
    pr."CREATED_BY",
    pr."STATE"
  FROM "PERMISSION_X_ROLE" pr
  WHERE pr."ROLE_ID" = v_source_role;

  -- Replica las relaciones con las opciones de menú
  INSERT INTO "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID")
  SELECT
    mxr."MENU_OPTION_ID",
    v_target_role
  FROM "MENU_OPTIONS_X_ROLES" mxr
  WHERE mxr."ROLE_ID" = v_source_role;
END
$$;
