import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGoalDailyTarget1760020000000 implements MigrationInterface {
  name = 'AddGoalDailyTarget1760020000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "GOAL_DAILY_TARGET" (
        "GOAL_DAILY_TARGET_ID" SERIAL PRIMARY KEY,
        "GOAL_ID" integer NOT NULL,
        "MODULE_ID" integer,
        "PERIOD" integer NOT NULL,
        "TARGET_DATE" date NOT NULL,
        "TARGET_VALUE" numeric NOT NULL,
        "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(),
        "CREATED_BY" integer,
        "STATE" char(1) NOT NULL DEFAULT 'A',
        "UPDATED_AT" TIMESTAMP DEFAULT now(),
        "UPDATED_BY" integer
      )
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET" DROP CONSTRAINT "FK_GOAL_DAILY_TARGET_MODULE"
    `)
    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET" DROP CONSTRAINT "FK_GOAL_DAILY_TARGET_GOAL"
    `)
    await queryRunner.query(`
      DROP INDEX "IDX_GOAL_DAILY_TARGET_UNIQUE"
    `)
    await queryRunner.query(`DROP TABLE "GOAL_DAILY_TARGET"`)
  }
}

