import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddGoalTaskTemplates1762500000000
  implements MigrationInterface
{
  name = 'AddGoalTaskTemplates1762500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'GOAL'
            AND column_name = 'TASK_TEMPLATES'
        ) THEN
          ALTER TABLE "GOAL"
            ADD COLUMN "TASK_TEMPLATES" jsonb NOT NULL DEFAULT '[]'::jsonb;
        END IF;
      END$$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GOAL" DROP COLUMN IF EXISTS "TASK_TEMPLATES";`
    )
  }
}
