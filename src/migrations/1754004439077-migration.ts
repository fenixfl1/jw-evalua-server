import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1754004439077 implements MigrationInterface {
  name = 'Migration1754004439077'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_b963f21f99b6634c60735af721e"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_c9f359899bb9076d7c817389a01"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `CREATE TABLE "PERMISSION_X_ROLE" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "PERMISSION_ID" integer NOT NULL, "ROLE_ID" integer NOT NULL, CONSTRAINT "PK_aba3c897a024c6ba7edf7a47da3" PRIMARY KEY ("PERMISSION_ID", "ROLE_ID"))`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "ID"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_AT"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_BY"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "STATE"`);
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`)
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID")`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "MENU_OPTION_ID" SET NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "ROLE_ID" SET NOT NULL`);
    // await queryRunner.query(`CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `);
    // await queryRunner.query(`CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_c9f359899bb9076d7c817389a01" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" ADD CONSTRAINT "FK_5b0ff7785c8f8885aab2ea9f905" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" ADD CONSTRAINT "FK_24cb3d11068904d9544b5add23b" FOREIGN KEY ("PERMISSION_ID") REFERENCES "PERMISSION"("PERMISSION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" ADD CONSTRAINT "FK_ae267066b6f7555d2adb197c85a" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE CASCADE`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" DROP CONSTRAINT "FK_ae267066b6f7555d2adb197c85a"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" DROP CONSTRAINT "FK_24cb3d11068904d9544b5add23b"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION_X_ROLE" DROP CONSTRAINT "FK_5b0ff7785c8f8885aab2ea9f905"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_c9f359899bb9076d7c817389a01"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "ROLE_ID" DROP NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "MENU_OPTION_ID" DROP NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f"`);
    await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`)
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "STATE" character NOT NULL DEFAULT 'A'`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_BY" integer NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "ID" integer NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`);
    await queryRunner.query(`DROP TABLE "PERMISSION_X_ROLE"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_c9f359899bb9076d7c817389a01" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_b963f21f99b6634c60735af721e" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
