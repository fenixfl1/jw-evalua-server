import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755550928961 implements MigrationInterface {
    name = 'Migration1755550928961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "STAFF_X_MODULE" DROP CONSTRAINT "FK_d24accafdc1ea2253b404678408"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_1b85e2063e5a2fd607568dbe803"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "MODULE_MODULE_ID_seq" OWNED BY "MODULE"."MODULE_ID"`);
        await queryRunner.query(`ALTER TABLE "MODULE" ALTER COLUMN "MODULE_ID" SET DEFAULT nextval('"MODULE_MODULE_ID_seq"')`);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_1b85e2063e5a2fd607568dbe803" FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF_X_MODULE" ADD CONSTRAINT "FK_d24accafdc1ea2253b404678408" FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STAFF_X_MODULE" DROP CONSTRAINT "FK_d24accafdc1ea2253b404678408"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_1b85e2063e5a2fd607568dbe803"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`ALTER TABLE "MODULE" ALTER COLUMN "MODULE_ID" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "MODULE_MODULE_ID_seq"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_1b85e2063e5a2fd607568dbe803" FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF_X_MODULE" ADD CONSTRAINT "FK_d24accafdc1ea2253b404678408" FOREIGN KEY ("MODULE_ID") REFERENCES "MODULE"("MODULE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
