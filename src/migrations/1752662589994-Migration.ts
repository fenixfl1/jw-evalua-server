import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752662589994 implements MigrationInterface {
    name = 'Migration1752662589994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ROLE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer NOT NULL, "STATE" character(1) NOT NULL DEFAULT 'A', "ROLE_ID" SERIAL NOT NULL, "NAME" character varying(30) NOT NULL, "DESCRIPTION" character varying(250) NOT NULL, CONSTRAINT "UQ_cfcd3a13b39580bf95cd2ef1b1f" UNIQUE ("NAME"), CONSTRAINT "PK_2464e6137ccbd5f89724b83282e" PRIMARY KEY ("ROLE_ID"))`);
        await queryRunner.query(`ALTER TABLE "ROLE" ADD CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ROLE" DROP CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28"`);
        await queryRunner.query(`DROP TABLE "ROLE"`);
    }

}
