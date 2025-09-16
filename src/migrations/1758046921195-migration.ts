import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758046921195 implements MigrationInterface {
    name = 'Migration1758046921195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`ALTER TABLE "GOAL" DROP COLUMN "MODULE_ID"`);
        
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "GOAL_GOAL_ID_seq" OWNED BY "GOAL"."GOAL_ID"`);
        await queryRunner.query(`ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" SET DEFAULT nextval('"GOAL_GOAL_ID_seq"')`);
        await queryRunner.query(`ALTER TYPE "public"."period_type_enum_old" RENAME TO "period_type_enum_old_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "CHK_STAFF_GENDER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`ALTER TABLE "PERIOD" ALTER COLUMN "TYPE" TYPE "public"."period_type_enum_old_old" USING "TYPE"::"text"::"public"."period_type_enum_old_old"`);
        await queryRunner.query(`DROP TYPE "public"."PERIOD_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."period_type_enum_old_old" RENAME TO "period_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "GOAL_GOAL_ID_seq"`);

        await queryRunner.query(`ALTER TABLE "GOAL" ADD "MODULE_ID" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
    }

}
