import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1758052612768 implements MigrationInterface {
    name = 'Migration1758052612768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" DROP COLUMN "TARGET_VALUE"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" ADD "TARGET_VALUE" numeric`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" DROP COLUMN "TARGET_VALUE"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" ADD "TARGET_VALUE" numeric NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" DROP CONSTRAINT "FK_fa1652ed9617ba07fed1a555372"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" DROP CONSTRAINT "FK_2f94bbcd2ed9d11ea9906f130bb"`);
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" DROP CONSTRAINT "FK_fae48ace910f3f1d3222a74e808"`);
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" DROP CONSTRAINT "FK_ebacb248821eba0100f64f5e87e"`);
        await queryRunner.query(`ALTER TABLE "GOAL_PROGRESS" DROP CONSTRAINT "FK_8745e33981fba7993185d1fe91a"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" DROP CONSTRAINT "FK_57f6c35613cdb8166a35a84ab73"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" DROP CONSTRAINT "FK_b039f29a765d956bdc1f58695f7"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "CHK_STAFF_GENDER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`);
        await queryRunner.query(`ALTER TABLE "PERIOD" ALTER COLUMN "TYPE" TYPE "public"."period_type_enum_old_old_old" USING "TYPE"::"text"::"public"."period_type_enum_old_old_old"`);
        await queryRunner.query(`DROP TYPE "public"."PERIOD_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."period_type_enum_old_old_old" RENAME TO "period_type_enum_old_old"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" DROP COLUMN "TARGET_VALUE"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_STAFF" ADD "TARGET_VALUE" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" DROP COLUMN "TARGET_VALUE"`);
        await queryRunner.query(`ALTER TABLE "GOAL_X_MODULE" ADD "TARGET_VALUE" bigint`);
        await queryRunner.query(`ALTER TABLE "ACTION" DROP CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "GENDER"`);
        await queryRunner.query(`CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
