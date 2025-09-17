import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758064844842 implements MigrationInterface {
    name = 'Migration1758064844842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" ADD "CONTENT" text`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD "GENDER" "public"."STAFF_gender_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."period_type_enum_old_old_old" RENAME TO "period_type_enum_old_old_old_old"`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "CHK_STAFF_GENDER" CHECK ("GENDER" IN ('M','F','O'))`);
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" ADD CONSTRAINT "FK_ebacb248821eba0100f64f5e87e" FOREIGN KEY ("STAFF_ID") REFERENCES "STAFF"("STAFF_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" DROP CONSTRAINT "FK_ebacb248821eba0100f64f5e87e"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3e0bac09494fb052114349b2a62"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "CHK_STAFF_GENDER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`CREATE TYPE "public"."period_type_enum_old_old_old_old" AS ENUM('weekly', 'monthly', 'custom')`);
        await queryRunner.query(`ALTER TABLE "PERIOD" ALTER COLUMN "TYPE" TYPE "public"."period_type_enum_old_old_old_old" USING "TYPE"::"text"::"public"."period_type_enum_old_old_old_old"`);
        await queryRunner.query(`DROP TYPE "public"."PERIOD_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."period_type_enum_old_old_old_old" RENAME TO "period_type_enum_old_old_old"`);
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" ADD "ACTUAL_VALUE" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ACTIVITY_LOG" DROP CONSTRAINT "PK_68a56a34c121833ade7ce683435"`);
        await queryRunner.query(`ALTER TABLE "ACTION" DROP CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "GENDER"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP COLUMN "CONTENT"`);
    }

}
