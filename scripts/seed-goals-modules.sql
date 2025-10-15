-- Seed goals, goal-module assignments, daily targets and progress samples
-- This script is idempotent: running it multiple times keeps the same dataset.

CREATE OR REPLACE FUNCTION public.seed_goal_module(
  p_supervisor_user_id integer,
  p_module_description text,
  p_goal_description text,
  p_goal_weight integer,
  p_period integer,
  p_goal_start date,
  p_goal_end date,
  p_daily_dates date[],
  p_daily_targets numeric[],
  p_daily_actuals numeric[]
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_module_id integer;
  v_goal_id integer;
  v_goal_module_id integer;
  v_target_sum numeric;
  v_idx integer;
  v_date date;
  v_target numeric;
  v_actual numeric;
BEGIN
  IF array_length(p_daily_dates, 1) IS NULL THEN
    RAISE EXCEPTION 'Daily arrays cannot be empty';
  END IF;

  IF array_length(p_daily_dates, 1) <> array_length(p_daily_targets, 1)
     OR array_length(p_daily_dates, 1) <> array_length(p_daily_actuals, 1) THEN
    RAISE EXCEPTION 'Daily arrays must have the same length';
  END IF;

  SELECT COALESCE(SUM(val), 0)
  INTO v_target_sum
  FROM unnest(p_daily_targets) AS val;

  SELECT "MODULE_ID"
  INTO v_module_id
  FROM public."MODULE"
  WHERE "DESCRIPTION" = p_module_description
  LIMIT 1;

  IF v_module_id IS NULL THEN
    INSERT INTO public."MODULE" (
      "DESCRIPTION",
      "SUPERVISOR_ID",
      "STATE"
    )
    VALUES (
      p_module_description,
      p_supervisor_user_id,
      'A'
    )
    RETURNING "MODULE_ID" INTO v_module_id;
  END IF;

  SELECT "GOAL_ID"
  INTO v_goal_id
  FROM public."GOAL"
  WHERE "DESCRIPTION" = p_goal_description
    AND "SCOPE" = 'module'
  LIMIT 1;

  IF v_goal_id IS NULL THEN
    INSERT INTO public."GOAL" (
      "DESCRIPTION",
      "START_DATE",
      "END_DATE",
      "TARGET_VALUE",
      "WEIGHT",
      "SCOPE",
      "STATE"
    )
    VALUES (
      p_goal_description,
      p_goal_start,
      p_goal_end,
      v_target_sum,
      p_goal_weight,
      'module',
      'A'
    )
    RETURNING "GOAL_ID" INTO v_goal_id;
  ELSE
    UPDATE public."GOAL"
    SET
      "START_DATE" = p_goal_start,
      "END_DATE" = p_goal_end,
      "TARGET_VALUE" = v_target_sum,
      "WEIGHT" = p_goal_weight,
      "STATE" = 'A'
    WHERE "GOAL_ID" = v_goal_id;
  END IF;

  SELECT "GOAL_MODULE_ID"
  INTO v_goal_module_id
  FROM public."GOAL_X_MODULE"
  WHERE "GOAL_ID" = v_goal_id
    AND "MODULE_ID" = v_module_id
    AND "PERIOD" = p_period
  LIMIT 1;

  IF v_goal_module_id IS NULL THEN
    INSERT INTO public."GOAL_X_MODULE" (
      "GOAL_ID",
      "MODULE_ID",
      "PERIOD",
      "TARGET_VALUE",
      "STATE"
    )
    VALUES (
      v_goal_id,
      v_module_id,
      p_period,
      v_target_sum,
      'A'
    )
    RETURNING "GOAL_MODULE_ID" INTO v_goal_module_id;
  ELSE
    UPDATE public."GOAL_X_MODULE"
    SET
      "TARGET_VALUE" = v_target_sum,
      "STATE" = 'A'
    WHERE "GOAL_MODULE_ID" = v_goal_module_id;
  END IF;

  FOR v_idx IN 1..array_length(p_daily_dates, 1) LOOP
    v_date := p_daily_dates[v_idx];
    v_target := p_daily_targets[v_idx];
    v_actual := p_daily_actuals[v_idx];

    PERFORM 1
    FROM public."GOAL_DAILY_TARGET"
    WHERE "GOAL_MODULE_ID" = v_goal_module_id
      AND "PERIOD" = p_period
      AND "TARGET_DATE" = v_date;

    IF NOT FOUND THEN
      INSERT INTO public."GOAL_DAILY_TARGET" (
        "GOAL_MODULE_ID",
        "PERIOD",
        "TARGET_DATE",
        "TARGET_VALUE",
        "STATE"
      )
      VALUES (
        v_goal_module_id,
        p_period,
        v_date,
        v_target,
        'A'
      );
    ELSE
      UPDATE public."GOAL_DAILY_TARGET"
      SET
        "TARGET_VALUE" = v_target,
        "STATE" = 'A'
      WHERE "GOAL_MODULE_ID" = v_goal_module_id
        AND "PERIOD" = p_period
        AND "TARGET_DATE" = v_date;
    END IF;

    PERFORM 1
    FROM public."GOAL_PROGRESS"
    WHERE "GOAL_MODULE_ID" = v_goal_module_id
      AND "GOAL_ID" = v_goal_id
      AND "MODULE_ID" = v_module_id
      AND "PERIOD" = p_period
      AND "SCOPE" = 'module'
      AND DATE(COALESCE("UPDATED_AT", "CREATED_AT")) = v_date;

    IF NOT FOUND THEN
      INSERT INTO public."GOAL_PROGRESS" (
        "GOAL_ID",
        "MODULE_ID",
        "GOAL_MODULE_ID",
        "SCOPE",
        "PERIOD",
        "ACTUAL_VALUE",
        "CREATED_AT",
        "UPDATED_AT",
        "STATE"
      )
      VALUES (
        v_goal_id,
        v_module_id,
        v_goal_module_id,
        'module',
        p_period,
        v_actual,
        v_date + TIME '08:00:00',
        v_date + TIME '18:00:00',
        'A'
      );
    ELSE
      UPDATE public."GOAL_PROGRESS"
      SET
        "ACTUAL_VALUE" = v_actual,
        "UPDATED_AT" = v_date + TIME '18:00:00',
        "STATE" = 'A'
      WHERE "GOAL_MODULE_ID" = v_goal_module_id
        AND "GOAL_ID" = v_goal_id
        AND "MODULE_ID" = v_module_id
        AND "PERIOD" = p_period
        AND "SCOPE" = 'module'
        AND DATE(COALESCE("UPDATED_AT", "CREATED_AT")) = v_date;
    END IF;
  END LOOP;
END;
$$;

DO $$
DECLARE
  v_staff_id integer;
  v_user_id integer;
BEGIN
  SELECT "STAFF_ID"
  INTO v_staff_id
  FROM public."STAFF"
  WHERE "EMAIL" = 'goal.supervisor@example.com'
  LIMIT 1;

  IF v_staff_id IS NULL THEN
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
    VALUES (
      'Carlos',
      'Mendoza',
      'goal.supervisor@example.com',
      DATE '1984-04-12',
      '8095550001',
      'M',
      '12345678901',
      'Zona Colonial, Santo Domingo',
      'A'
    )
    RETURNING "STAFF_ID" INTO v_staff_id;
  END IF;

  SELECT "USER_ID"
  INTO v_user_id
  FROM public."USERS"
  WHERE "USERNAME" = 'goal.supervisor'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    INSERT INTO public."USERS" (
      "STAFF_ID",
      "USERNAME",
      "PASSWORD_HASH",
      "IS_ACTIVE",
      "STATE"
    )
    VALUES (
      v_staff_id,
      'goal.supervisor',
      '$2b$10$1bPQxSNzpNjd8t0mFDhYeOxuTW/6nYuxrwbozV3.rroWAtxEvsCq.',
      TRUE,
      'A'
    )
    RETURNING "USER_ID" INTO v_user_id;
  ELSE
    UPDATE public."USERS"
    SET
      "STAFF_ID" = v_staff_id,
      "IS_ACTIVE" = TRUE,
      "STATE" = 'A'
    WHERE "USER_ID" = v_user_id;
  END IF;

  PERFORM public.seed_goal_module(
    v_user_id,
    'Modulo Produccion Alpha',
    'Meta Semanal de Produccion Alpha',
    15,
    202541,
    DATE '2025-10-06',
    DATE '2025-10-11',
    ARRAY[
      DATE '2025-10-06',
      DATE '2025-10-07',
      DATE '2025-10-08',
      DATE '2025-10-09',
      DATE '2025-10-10',
      DATE '2025-10-11'
    ],
    ARRAY[2800, 2800, 2800, 2800, 2800, 1400],
    ARRAY[2750, 2700, 2900, 2850, 2650, 1500]
  );

  PERFORM public.seed_goal_module(
    v_user_id,
    'Modulo Bordado Beta',
    'Meta Semanal de Calidad Beta',
    20,
    202542,
    DATE '2025-10-13',
    DATE '2025-10-18',
    ARRAY[
      DATE '2025-10-13',
      DATE '2025-10-14',
      DATE '2025-10-15',
      DATE '2025-10-16',
      DATE '2025-10-17',
      DATE '2025-10-18'
    ],
    ARRAY[1500, 1500, 1500, 1500, 1500, 800],
    ARRAY[1480, 1520, 1490, 1510, 1505, 780]
  );
END;
$$;

DROP FUNCTION IF EXISTS public.seed_goal_module(
  integer,
  text,
  text,
  integer,
  integer,
  date,
  date,
  date[],
  numeric[],
  numeric[]
);
