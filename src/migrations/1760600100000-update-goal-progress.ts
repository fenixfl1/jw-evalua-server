import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateGoalProgress1760600100000 implements MigrationInterface {
  name = 'UpdateGoalProgress1760600100000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      ADD COLUMN "GOAL_MODULE_ID" integer
    `)

    await queryRunner.query(`
      UPDATE "GOAL_PROGRESS" gp
      SET "GOAL_MODULE_ID" = gm."GOAL_MODULE_ID"
      FROM "GOAL_X_MODULE" gm
      WHERE gm."GOAL_ID" = gp."GOAL_ID"
        AND (gm."MODULE_ID" IS NOT DISTINCT FROM gp."MODULE_ID")
        AND (gm."PERIOD" IS NULL OR gm."PERIOD" IS NOT DISTINCT FROM gp."PERIOD")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_GOAL_PROGRESS_GOAL_MODULE"
      ON "GOAL_PROGRESS" ("GOAL_MODULE_ID")
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      ADD CONSTRAINT "FK_GOAL_PROGRESS_GOAL_MODULE"
      FOREIGN KEY ("GOAL_MODULE_ID")
      REFERENCES "GOAL_X_MODULE" ("GOAL_MODULE_ID")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      ALTER COLUMN "ACTUAL_VALUE" TYPE bigint
      USING "ACTUAL_VALUE"::bigint
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      DROP CONSTRAINT "FK_GOAL_PROGRESS_GOAL_MODULE"
    `)

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_GOAL_PROGRESS_GOAL_MODULE"
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      DROP COLUMN "GOAL_MODULE_ID"
    `)
  }
}

