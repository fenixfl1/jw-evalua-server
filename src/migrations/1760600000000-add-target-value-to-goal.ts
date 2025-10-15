import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTargetValueToGoal1760600000000 implements MigrationInterface {
  name = 'AddTargetValueToGoal1760600000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL"
      ADD COLUMN "TARGET_VALUE" numeric NOT NULL DEFAULT 0
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "GOAL"
      DROP COLUMN "TARGET_VALUE"
    `)
  }
}

