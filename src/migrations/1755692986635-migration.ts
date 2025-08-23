import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755692986635 implements MigrationInterface {
    name = 'Migration1755692986635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "FK_d9793973a8feee9057072c2c93e"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "DEPARTMENT_ID"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD "MODULE_ID" integer`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "STAFF_ID" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "IS_ACTIVE" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" ALTER COLUMN "PARENT_ID" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "FK_6959a222385d4145719ceb62226"`);
        await queryRunner.query(`ALTER TABLE "STAFF" ALTER COLUMN "CREATED_BY" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57"`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "AVATAR" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "LOGIN_COUNT" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "LAST_LOGIN" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "CREATED_BY" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "FK_6959a222385d4145719ceb62226" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "FK_d11fbcc2e9a1b168e05a1251c2e" FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8" FOREIGN KEY ("STAFF_ID") REFERENCES "STAFF"("STAFF_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "FK_d11fbcc2e9a1b168e05a1251c2e"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "FK_6959a222385d4145719ceb62226"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "CREATED_BY" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "LAST_LOGIN" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "LOGIN_COUNT" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "AVATAR" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF" ALTER COLUMN "CREATED_BY" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "FK_6959a222385d4145719ceb62226" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" ALTER COLUMN "PARENT_ID" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "IS_ACTIVE"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "STAFF_ID"`);
        await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "MODULE_ID"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD "DEPARTMENT_ID" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "FK_d9793973a8feee9057072c2c93e" FOREIGN KEY ("DEPARTMENT_ID") REFERENCES "DEPARTMENT"("DEPARTMENT_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
