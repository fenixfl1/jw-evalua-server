import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755617151613 implements MigrationInterface {
    name = 'Migration1755617151613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`CREATE TABLE "ACTIVITY_LOG" ("ID" SERIAL NOT NULL, "USER_ID" integer NOT NULL, "ACTION" character varying(100) NOT NULL, "MODEL" character varying(150) NOT NULL, "OBJECT_ID" integer, "CHANGES" jsonb, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_68a56a34c121833ade7ce683435" PRIMARY KEY ("ID"))`);
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
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ACTIVITY_LOG" ADD CONSTRAINT "FK_22655a7b2a103dec25107c5d076" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ACTIVITY_LOG" DROP CONSTRAINT "FK_22655a7b2a103dec25107c5d076"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`);
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
        await queryRunner.query(`DROP TABLE "ACTIVITY_LOG"`);
        await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
