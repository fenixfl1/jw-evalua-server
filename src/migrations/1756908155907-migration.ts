import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1756908155907 implements MigrationInterface {
  name = 'Migration1756908155907'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    // )
    await queryRunner.query(
      `CREATE TABLE "GOAL_X_STAFF" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_STAFF_ID" SERIAL NOT NULL, "GOAL_ID" integer NOT NULL, "STAFF_ID" integer NOT NULL, "PERIOD_ID" integer NOT NULL, "TARGET_VALUE" bigint NOT NULL, "WEIGHT" numeric NOT NULL, CONSTRAINT "PK_a638fb438a78ca2e89d17326205" PRIMARY KEY ("GOAL_STAFF_ID"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."GOAL_PROGRESS_scope_enum" AS ENUM('individual', 'module')`
    )
    await queryRunner.query(
      `CREATE TABLE "GOAL_PROGRESS" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_PROGRESS_ID" SERIAL NOT NULL, "GOAL_ID" integer NOT NULL, "SCOPE" "public"."GOAL_PROGRESS_scope_enum" NOT NULL, "PERIOD_ID" integer NOT NULL, "STAFF_ID" integer, "MODULE_ID" integer, "ACTUAL_VALUE" bigint NOT NULL, CONSTRAINT "PK_550d2158f7acf25e165c397006d" PRIMARY KEY ("GOAL_PROGRESS_ID"))`
    )
    await queryRunner.query(
      `CREATE TABLE "GOAL_X_MODULE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_MODULE_ID" SERIAL NOT NULL, "GOAL_ID" integer NOT NULL, "MODULE_ID" integer NOT NULL, "PERIOD_ID" integer, "TARGET_VALUE" bigint, CONSTRAINT "PK_80938948bdeeb8114e9350501a0" PRIMARY KEY ("GOAL_MODULE_ID"))`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`)
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`)
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_27488ae7e50440d4a06b585798b" PRIMARY KEY ("USER_ID", "ROLE_ID")`
    // )
    // // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`);
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_4200dc942e6cdcf10228ce02684" PRIMARY KEY ("ID", "USER_ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_4200dc942e6cdcf10228ce02684"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_889f66c9c59dcad8621020d62ae" PRIMARY KEY ("USER_ID", "ID", "ROLE_ID")`
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`);
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_4200dc942e6cdcf10228ce02684" PRIMARY KEY ("USER_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_4200dc942e6cdcf10228ce02684"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_889f66c9c59dcad8621020d62ae" PRIMARY KEY ("USER_ID", "ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_27488ae7e50440d4a06b585798b"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`)
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`)
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    // )
    await queryRunner.query(`DROP TABLE "GOAL_X_MODULE"`)
    await queryRunner.query(`DROP TABLE "GOAL_PROGRESS"`)
    await queryRunner.query(`DROP TYPE "public"."GOAL_PROGRESS_scope_enum"`)
    await queryRunner.query(`DROP TABLE "GOAL_X_STAFF"`)
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
  }
}
