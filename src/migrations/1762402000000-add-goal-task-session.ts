import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGoalTaskSession1762402000000
  implements MigrationInterface
{
  name = 'AddGoalTaskSession1762402000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "GOAL_TASK_SESSION" (
        "GOAL_TASK_SESSION_ID" SERIAL PRIMARY KEY,
        "GOAL_TASK_ID" integer NOT NULL,
        "GOAL_MODULE_ID" integer,
        "MODULE_ID" integer,
        "PERIOD" integer,
        "STAFF_ID" integer NOT NULL,
        "STARTED_AT" TIMESTAMP NOT NULL,
        "ENDED_AT" TIMESTAMP,
        "ACCUMULATED_SECONDS" numeric(12,2) DEFAULT 0 NOT NULL,
        "LAST_RESUMED_AT" TIMESTAMP,
        "IS_ACTIVE" boolean NOT NULL DEFAULT true,
        "CREATED_AT" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "CREATED_BY" integer,
        "STATE" char(1) NOT NULL DEFAULT 'A',
        "UPDATED_AT" TIMESTAMP,
        "UPDATED_BY" integer
      );
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_SESSION_ACTIVE"
      ON "GOAL_TASK_SESSION" ("GOAL_TASK_ID", "STAFF_ID", "IS_ACTIVE");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "GOAL_TASK_SESSION"`)
  }
}
