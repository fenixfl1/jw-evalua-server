import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnitsPerItemToGoalTask1762401000000
  implements MigrationInterface
{
  name = 'AddUnitsPerItemToGoalTask1762401000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'GOAL_TASK'
            AND column_name = 'UNITS_PER_ITEM'
        ) THEN
          ALTER TABLE "GOAL_TASK"
            ADD COLUMN "UNITS_PER_ITEM" numeric(10,2) DEFAULT 1 NOT NULL;
        END IF;
      END$$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GOAL_TASK" DROP COLUMN IF EXISTS "UNITS_PER_ITEM";`
    )
  }
}
