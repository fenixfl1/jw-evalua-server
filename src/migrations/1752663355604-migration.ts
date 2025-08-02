import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1752663355604 implements MigrationInterface {
  name = 'Migration1752663355604'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."MENU_OPTION_type_enum" AS ENUM('group', 'divider', 'link')`
    )
    await queryRunner.query(
      `CREATE TABLE "MENU_OPTION" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer NOT NULL, "STATE" character(1) NOT NULL DEFAULT 'A', "MENU_OPTION_ID" character varying(50) NOT NULL, "NAME" character varying(100) NOT NULL, "DESCRIPTION" character varying(250), "PATH" character varying(100), "TYPE" "public"."MENU_OPTION_type_enum", "ICON" text, "ORDER" integer NOT NULL, "PARENT_ID" character varying NOT NULL, CONSTRAINT "PK_c33923d6f156b267e8e4dfe59c3" PRIMARY KEY ("MENU_OPTION_ID"))`
    )
    // await queryRunner.query(`CREATE TABLE "MENU_OPTIONS_X_ROLES" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer NOT NULL, "STATE" character(1) NOT NULL DEFAULT 'A', "ID" integer NOT NULL, "MENU_OPTION_ID" character varying(50), "ROLE_ID" integer, CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID"))`);
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_b963f21f99b6634c60735af721e" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_b963f21f99b6634c60735af721e"`);
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe"`
    )
    // await queryRunner.query(`DROP TABLE "MENU_OPTIONS_X_ROLES"`);
    await queryRunner.query(`DROP TABLE "MENU_OPTION"`)
    await queryRunner.query(`DROP TYPE "public"."MENU_OPTION_type_enum"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `
    )
  }
}
