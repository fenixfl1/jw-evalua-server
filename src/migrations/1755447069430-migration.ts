import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755447069430 implements MigrationInterface {
    name = 'Migration1755447069430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACTION" DROP CONSTRAINT "FK_cd81ce38f4455efde440e99ffa0"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION_X_ROLE" DROP CONSTRAINT "FK_5b0ff7785c8f8885aab2ea9f905"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_f8162ac3b4eeffe234362266e35"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_c9f359899bb9076d7c817389a01"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`CREATE TABLE "MODULE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "MODULE_ID" integer NOT NULL, "DESCRIPTION" character varying(150) NOT NULL, "SUPERVISOR_ID" integer NOT NULL, CONSTRAINT "PK_4d733a2e60db181ead5029c4f2a" PRIMARY KEY ("MODULE_ID"))`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3e0bac09494fb052114349b2a62"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP COLUMN "MENU_OPTION_ID"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD "MENU_OPTION_ID" character varying`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ALTER COLUMN "ACTION_ID" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES "ACTION"("ACTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MODULE" ADD CONSTRAINT "FK_8b35e265973ca359f88acc0003a" FOREIGN KEY ("SUPERVISOR_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MODULE" DROP CONSTRAINT "FK_8b35e265973ca359f88acc0003a"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3e0bac09494fb052114349b2a62"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ALTER COLUMN "ACTION_ID" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" DROP COLUMN "MENU_OPTION_ID"`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD "MENU_OPTION_ID" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES "ACTION"("ACTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "MODULE"`);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_c9f359899bb9076d7c817389a01" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_f8162ac3b4eeffe234362266e35" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PERMISSION_X_ROLE" ADD CONSTRAINT "FK_5b0ff7785c8f8885aab2ea9f905" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ACTION" ADD CONSTRAINT "FK_cd81ce38f4455efde440e99ffa0" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
