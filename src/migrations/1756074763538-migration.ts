import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1756074763538 implements MigrationInterface {
  name = 'Migration1756074763538'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."GOAL_scope_enum" AS ENUM('individual', 'module')`
    )
    await queryRunner.query(
      `CREATE TABLE "GOAL" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_ID" SERIAL NOT NULL, "MODULE_ID" integer NOT NULL, "DESCRIPTION" character varying NOT NULL, "START_DATE" TIMESTAMP NOT NULL, "END_DATE" TIMESTAMP NOT NULL, "WEIGHT" integer NOT NULL, "SCOPE" "public"."GOAL_scope_enum" NOT NULL, CONSTRAINT "PK_31918bd1daf1306b0e32a329ea7" PRIMARY KEY ("GOAL_ID"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    await queryRunner.query(`DROP TABLE "GOAL"`)
    await queryRunner.query(`DROP TYPE "public"."GOAL_scope_enum"`)
  }
}
