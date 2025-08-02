import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1754004212601 implements MigrationInterface {
  name = 'Migration1754004212601'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE" DROP CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28"`
    )
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
      `CREATE TABLE "ACTION" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "ACTION_ID" SERIAL NOT NULL, "NAME" character varying(255) NOT NULL, "DESCRIPTION" character varying(255), CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac" PRIMARY KEY ("ACTION_ID"))`
    )
    await queryRunner.query(
      `CREATE TABLE "PERMISSION" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "PERMISSION_ID" SERIAL NOT NULL, "DESCRIPTION" character varying(255), "MENU_OPTION_ID" character varying(50), "ACTION_ID" integer, CONSTRAINT "PK_7efad0105d237300cbd89505d3d" PRIMARY KEY ("PERMISSION_ID"))`
    )
    await queryRunner.query(
      `CREATE TABLE "ROLE_X_PERMISSION" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "PERMISSION_ID" integer NOT NULL, "ROLE_ID" integer NOT NULL, CONSTRAINT "PK_1daeb68c929a23440933008dcd0" PRIMARY KEY ("PERMISSION_ID", "ROLE_ID"))`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP COLUMN "STATE"`)
    await queryRunner.query(`ALTER TABLE "ROLE" DROP COLUMN "CREATED_AT"`)
    await queryRunner.query(`ALTER TABLE "ROLE" DROP COLUMN "CREATED_BY"`)
    await queryRunner.query(`ALTER TABLE "ROLE" DROP COLUMN "STATE"`)
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
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`
    )
    await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP COLUMN "TYPE"`)
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD "TYPE" "public"."MENU_OPTION_type_enum"`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTION" ALTER COLUMN "PARENT_ID" SET NOT NULL`
    // )
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
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ACTION" ADD CONSTRAINT "FK_cd81ce38f4455efde440e99ffa0" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_f8162ac3b4eeffe234362266e35" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES "ACTION"("ACTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE_X_PERMISSION" ADD CONSTRAINT "FK_efb2dfed9dad6cb277a5897e010" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE_X_PERMISSION" ADD CONSTRAINT "FK_7a73adef6a37de3385f3c262dce" FOREIGN KEY ("PERMISSION_ID") REFERENCES "PERMISSION"("PERMISSION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE_X_PERMISSION" ADD CONSTRAINT "FK_b58460781260bd2b802546df081" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE CASCADE`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`);
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`);
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
      `ALTER TABLE "ROLE_X_PERMISSION" DROP CONSTRAINT "FK_b58460781260bd2b802546df081"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE_X_PERMISSION" DROP CONSTRAINT "FK_7a73adef6a37de3385f3c262dce"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE_X_PERMISSION" DROP CONSTRAINT "FK_efb2dfed9dad6cb277a5897e010"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3e0bac09494fb052114349b2a62"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_f8162ac3b4eeffe234362266e35"`
    )
    await queryRunner.query(
      `ALTER TABLE "ACTION" DROP CONSTRAINT "FK_cd81ce38f4455efde440e99ffa0"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`
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
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ALTER COLUMN "PARENT_ID" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "MENU_OPTION" DROP COLUMN "TYPE"`)
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD "TYPE" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
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
    await queryRunner.query(
      `ALTER TABLE "ROLE" ADD "STATE" character NOT NULL DEFAULT 'A'`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE" ADD "CREATED_BY" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLE" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD "STATE" character NOT NULL DEFAULT 'A'`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD "CREATED_BY" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`DROP TABLE "ROLE_X_PERMISSION"`)
    await queryRunner.query(`DROP TABLE "PERMISSION"`)
    await queryRunner.query(`DROP TABLE "ACTION"`)
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
    await queryRunner.query(
      `ALTER TABLE "ROLE" ADD CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
