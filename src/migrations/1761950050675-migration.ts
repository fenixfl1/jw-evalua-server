import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761950050675 implements MigrationInterface {
    name = 'Migration1761950050675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "GOAL_TASK" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_TASK_ID" integer NOT NULL, "GOAL_ID" integer NOT NULL, "DESCRIPTION" character varying(100) NOT NULL, "COMMENT" character varying(500), "TARGET" integer NOT NULL, CONSTRAINT "PK_c4a29e419a632d87d102db0b0ca" PRIMARY KEY ("GOAL_TASK_ID"))`);
        await queryRunner.query(`CREATE TABLE "GOAL_TASK_X_STAFF" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_TASK_STAFF_ID" integer NOT NULL, "GOAL_TASK_ID" integer NOT NULL, "TARGET" integer NOT NULL, "STAFF_ID" integer NOT NULL, CONSTRAINT "PK_5ae80785a0d9c8c2232df88f8e3" PRIMARY KEY ("GOAL_TASK_STAFF_ID"))`);
        await queryRunner.query(`ALTER TABLE "GOAL_TASK" ADD CONSTRAINT "FK_f7d22ff861f001b853618131c10" FOREIGN KEY ("GOAL_ID") REFERENCES "GOAL"("GOAL_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GOAL_TASK_X_STAFF" ADD CONSTRAINT "FK_5b6829f540d83818c9a08b16485" FOREIGN KEY ("GOAL_TASK_ID") REFERENCES "GOAL_TASK"("GOAL_TASK_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "GOAL_TASK_X_STAFF" DROP CONSTRAINT "FK_5b6829f540d83818c9a08b16485"`);
        await queryRunner.query(`ALTER TABLE "GOAL_TASK" DROP CONSTRAINT "FK_f7d22ff861f001b853618131c10"`);
        await queryRunner.query(`DROP TABLE "GOAL_TASK_X_STAFF"`);
        await queryRunner.query(`DROP TABLE "GOAL_TASK"`);
    }

}
