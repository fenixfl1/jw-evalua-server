import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752662474818 implements MigrationInterface {
    name = 'Migration1752662474818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "USERS" ("USER_ID" SERIAL NOT NULL, "USERNAME" character varying(25) NOT NULL, "PASSWORD" character varying NOT NULL, "LOGIN_COUNT" character varying NOT NULL, "LAST_LOGIN" TIMESTAMP NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer NOT NULL, "STATE" character(1) NOT NULL DEFAULT 'A', CONSTRAINT "PK_f37d934f4f6abb757dce91ce6f2" PRIMARY KEY ("USER_ID"))`);
        await queryRunner.query(`CREATE TABLE "STAFF" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer NOT NULL, "STATE" character(1) NOT NULL DEFAULT 'A', "STAFF_ID" integer NOT NULL, "NAME" character varying NOT NULL, "LAST_NAME" character varying NOT NULL, "EMAIL" character varying NOT NULL, "BIRTH_DATA" date NOT NULL, "PHONE" character varying NOT NULL, "GENDER" character(1) NOT NULL, "IDENTITY_DOCUMENT" character varying(11) NOT NULL, "ADDRESS" text NOT NULL, "AVATAR" text NOT NULL, CONSTRAINT "PK_9d3026d6816040c56533cfd122e" PRIMARY KEY ("STAFF_ID"))`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "STAFF" ADD CONSTRAINT "FK_6959a222385d4145719ceb62226" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "STAFF" DROP CONSTRAINT "FK_6959a222385d4145719ceb62226"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57"`);
        await queryRunner.query(`DROP TABLE "STAFF"`);
        await queryRunner.query(`DROP TABLE "USERS"`);
    }

}
