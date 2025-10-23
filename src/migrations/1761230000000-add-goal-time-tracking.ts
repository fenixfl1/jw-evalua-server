import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGoalTimeTracking1761230000000 implements MigrationInterface {
  name = 'AddGoalTimeTracking1761230000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      ADD COLUMN "ACTUAL_TIME" numeric
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      ADD COLUMN "TARGET_TIME" numeric
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL_DAILY_TARGET"
      DROP COLUMN "TARGET_TIME"
    `)

    await queryRunner.query(`
      ALTER TABLE "GOAL_PROGRESS"
      DROP COLUMN "ACTUAL_TIME"
    `)
  }
}

