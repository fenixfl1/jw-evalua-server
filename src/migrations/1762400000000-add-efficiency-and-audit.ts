import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEfficiencyAndAudit1762400000000 implements MigrationInterface {
  name = 'AddEfficiencyAndAudit1762400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "MODULE_EFFICIENCY" (
        "MODULE_EFFICIENCY_ID" SERIAL PRIMARY KEY,
        "MODULE_ID" integer NOT NULL,
        "PERIOD" integer NOT NULL,
        "TOTAL_UNITS" numeric(12,2) NOT NULL,
        "SAM" numeric(8,2) NOT NULL,
        "MINUTES_WORKED" numeric(10,2) NOT NULL,
        "EFFICIENCY_PERCENT" numeric(8,2) NOT NULL,
        "NOTES" varchar(255),
        "CREATED_AT" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "CREATED_BY" integer,
        "STATE" char(1) NOT NULL DEFAULT 'A',
        "UPDATED_AT" TIMESTAMP,
        "UPDATED_BY" integer
      );
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "PROCESS_AUDIT" (
        "PROCESS_AUDIT_ID" SERIAL PRIMARY KEY,
        "MODULE_ID" integer NOT NULL,
        "AUDIT_DATE" date NOT NULL,
        "SHIFT" varchar(50),
        "STYLE" varchar(120),
        "SUPERVISOR" varchar(120),
        "AUDITOR" varchar(120),
        "ENTRIES" jsonb NOT NULL,
        "COMMENTS" varchar(255),
        "CREATED_AT" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "CREATED_BY" integer,
        "STATE" char(1) NOT NULL DEFAULT 'A',
        "UPDATED_AT" TIMESTAMP,
        "UPDATED_BY" integer
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "PROCESS_AUDIT"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "MODULE_EFFICIENCY"`)
  }
}
