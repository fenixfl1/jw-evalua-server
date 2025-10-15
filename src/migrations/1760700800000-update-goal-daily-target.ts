import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGoalDailyTarget1760700800000 implements MigrationInterface {
  name = 'UpdateGoalDailyTarget1760700800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD COLUMN "GOAL_MODULE_ID" integer
    `)

    await queryRunner.query(`
      UPDATE "GOAL_DAILY_TARGET" gdt
      SET "GOAL_MODULE_ID" = gm."GOAL_MODULE_ID"
      FROM "GOAL_X_MODULE" gm
      WHERE gm."GOAL_ID" = gdt."GOAL_ID"
        AND (gm."MODULE_ID" IS NOT DISTINCT FROM gdt."MODULE_ID")
        AND (gm."PERIOD" IS NOT DISTINCT FROM gdt."PERIOD")
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM "GOAL_DAILY_TARGET" WHERE "GOAL_MODULE_ID" IS NULL
        ) THEN
          RAISE EXCEPTION 'Could not determine GOAL_MODULE_ID for all rows in GOAL_DAILY_TARGET';
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ALTER COLUMN "GOAL_MODULE_ID" SET NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP CONSTRAINT IF EXISTS "FK_GOAL_DAILY_TARGET_MODULE"
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP CONSTRAINT IF EXISTS "FK_GOAL_DAILY_TARGET_GOAL"
    `)

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_GOAL_DAILY_TARGET_UNIQUE"
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_GOAL_DAILY_TARGET_UNIQUE"
      ON "GOAL_DAILY_TARGET" ("GOAL_MODULE_ID", "PERIOD", "TARGET_DATE")
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD CONSTRAINT "FK_GOAL_DAILY_TARGET_GOAL_MODULE"
      FOREIGN KEY ("GOAL_MODULE_ID") REFERENCES "GOAL_X_MODULE"("GOAL_MODULE_ID")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP COLUMN "GOAL_ID"
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP COLUMN "MODULE_ID"
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP CONSTRAINT IF EXISTS "FK_GOAL_DAILY_TARGET_GOAL_MODULE"
    `)

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_GOAL_DAILY_TARGET_UNIQUE"
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD COLUMN "GOAL_ID" integer
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD COLUMN "MODULE_ID" integer
    `)

    await queryRunner.query(`
      UPDATE "GOAL_DAILY_TARGET" gdt
      SET "GOAL_ID" = gm."GOAL_ID",
          "MODULE_ID" = gm."MODULE_ID"
      FROM "GOAL_X_MODULE" gm
      WHERE gm."GOAL_MODULE_ID" = gdt."GOAL_MODULE_ID"
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM "GOAL_DAILY_TARGET" WHERE "GOAL_ID" IS NULL
        ) THEN
          RAISE EXCEPTION 'Could not restore GOAL_ID for all rows in GOAL_DAILY_TARGET';
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ALTER COLUMN "GOAL_ID" SET NOT NULL
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_GOAL_DAILY_TARGET_UNIQUE"
      ON "GOAL_DAILY_TARGET" ("GOAL_ID", "MODULE_ID", "PERIOD", "TARGET_DATE")
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD CONSTRAINT "FK_GOAL_DAILY_TARGET_GOAL"
      FOREIGN KEY ("GOAL_ID") REFERENCES "GOAL"("GOAL_ID")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD CONSTRAINT "FK_GOAL_DAILY_TARGET_MODULE"
      FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP COLUMN "GOAL_MODULE_ID"
    `)
  }
}

