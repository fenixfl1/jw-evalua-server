import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1757979808417 implements MigrationInterface {
  name = 'Migration1757979808417'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_STAFF" DROP CONSTRAINT "FK_3a48e234c55c19df9fa47787522"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_MODULE" DROP CONSTRAINT "FK_b079b08e005d25756d8300a0568"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_PROGRESS" DROP CONSTRAINT "FK_ebee84489b1c79d37f4c4cab7cc"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_GOAL_PROGRESS_COMPOSITE"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_PERIOD_NAME"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERIOD" DROP CONSTRAINT "CHK_PERIOD_DATES"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_STAFF" RENAME COLUMN "PERIOD_ID" TO "PERIOD"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_MODULE" RENAME COLUMN "PERIOD_ID" TO "PERIOD"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_PROGRESS" RENAME COLUMN "PERIOD_ID" TO "PERIOD"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`
    )
    await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`)
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
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_27488ae7e50440d4a06b585798b" PRIMARY KEY ("USER_ID", "ROLE_ID")`
    )
    // await queryRunner.query(`ALTER TABLE "ACTION" ADD CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac" PRIMARY KEY ("ACTION_ID")`);
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ALTER COLUMN "UPDATED_AT" SET DEFAULT now()`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    await queryRunner.query(
      `ALTER TABLE "STAFF" DROP CONSTRAINT "CHK_STAFF_GENDER"`
    )
    await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "GENDER"`)
    await queryRunner.query(
      `CREATE TYPE "public"."STAFF_gender_enum" AS ENUM('M', 'F', 'O')`
    )
    await queryRunner.query(
      `ALTER TABLE "STAFF" ALTER COLUMN "UPDATED_AT" SET DEFAULT now()`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ACTIVITY_LOG" ADD CONSTRAINT "PK_68a56a34c121833ade7ce683435" PRIMARY KEY ("ID")`
    // )
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "GOAL_GOAL_ID_seq" OWNED BY "GOAL"."GOAL_ID"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" SET DEFAULT nextval('"GOAL_GOAL_ID_seq"')`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."period_type_enum" RENAME TO "period_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."PERIOD_type_enum" AS ENUM('weekly', 'monthly', 'custom')`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "PERIOD" ALTER COLUMN "TYPE" TYPE "public"."PERIOD_type_enum" USING "TYPE"::"text"::"public"."PERIOD_type_enum"`
    // )
    // await queryRunner.query(`DROP TYPE "public"."period_type_enum_old"`)
    await queryRunner.query(
      `ALTER TABLE "BUSINESS" ALTER COLUMN "CREATED_AT" SET DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "BUSINESS" ALTER COLUMN "UPDATED_AT" SET DEFAULT now()`
    )
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
    await queryRunner.query(
      `CREATE INDEX "IDX_GOAL_PROGRESS_COMPOSITE" ON "GOAL_PROGRESS" ("GOAL_ID", "PERIOD", "MODULE_ID", "STAFF_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7a0fccc9b59507f4cf790bcf22" ON "PERIOD" ("NAME") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `
    )
    // await queryRunner.query(
    //   `ALTER TABLE "STAFF" ADD CONSTRAINT "CHK_STAFF_GENDER" CHECK ("GENDER" IN ('M','F','O'))`
    // )
    await queryRunner.query(
      `ALTER TABLE "PERIOD" ADD CONSTRAINT "CHK_882c24b5f288392f78253fc194" CHECK ("START_DATE" <= "END_DATE")`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES "ACTION"("ACTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" DROP CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3e0bac09494fb052114349b2a62"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERMISSION" DROP CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERIOD" DROP CONSTRAINT "CHK_882c24b5f288392f78253fc194"`
    )
    await queryRunner.query(
      `ALTER TABLE "STAFF" DROP CONSTRAINT "CHK_STAFF_GENDER"`
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a0fccc9b59507f4cf790bcf22"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_GOAL_PROGRESS_COMPOSITE"`)
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`
    // )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_4200dc942e6cdcf10228ce02684" PRIMARY KEY ("USER_ID", "ID")`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_4200dc942e6cdcf10228ce02684"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    await queryRunner.query(
      `ALTER TABLE "BUSINESS" ALTER COLUMN "UPDATED_AT" SET DEFAULT CURRENT_TIMESTAMP`
    )
    await queryRunner.query(
      `ALTER TABLE "BUSINESS" ALTER COLUMN "CREATED_AT" SET DEFAULT CURRENT_TIMESTAMP`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."period_type_enum_old" AS ENUM('weekly', 'monthly', 'custom')`
    )
    await queryRunner.query(
      `ALTER TABLE "PERIOD" ALTER COLUMN "TYPE" TYPE "public"."period_type_enum_old" USING "TYPE"::"text"::"public"."period_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "public"."PERIOD_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."period_type_enum_old" RENAME TO "period_type_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" SET DEFAULT nextval('"GOAL_GOAL_ID_seq1"')`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL" ALTER COLUMN "GOAL_ID" DROP DEFAULT`
    )
    await queryRunner.query(`DROP SEQUENCE "GOAL_GOAL_ID_seq"`)
    await queryRunner.query(
      `ALTER TABLE "ACTIVITY_LOG" DROP CONSTRAINT "PK_68a56a34c121833ade7ce683435"`
    )
    await queryRunner.query(
      `ALTER TABLE "STAFF" ALTER COLUMN "UPDATED_AT" SET DEFAULT CURRENT_TIMESTAMP`
    )
    await queryRunner.query(`ALTER TABLE "STAFF" DROP COLUMN "GENDER"`)
    await queryRunner.query(`DROP TYPE "public"."STAFF_gender_enum"`)
    await queryRunner.query(
      `ALTER TABLE "STAFF" ADD "GENDER" character NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "STAFF" ADD CONSTRAINT "CHK_STAFF_GENDER" CHECK (("GENDER" = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar])))`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`
    // )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_889f66c9c59dcad8621020d62ae" PRIMARY KEY ("USER_ID", "ROLE_ID", "ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTION" ALTER COLUMN "UPDATED_AT" SET DEFAULT CURRENT_TIMESTAMP`
    )
    await queryRunner.query(
      `ALTER TABLE "ACTION" DROP CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_27488ae7e50440d4a06b585798b"`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`
    // )
    await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`)
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`
    )
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
      `ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_PROGRESS" RENAME COLUMN "PERIOD" TO "PERIOD_ID"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_MODULE" RENAME COLUMN "PERIOD" TO "PERIOD_ID"`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_STAFF" RENAME COLUMN "PERIOD" TO "PERIOD_ID"`
    )
    await queryRunner.query(
      `ALTER TABLE "PERIOD" ADD CONSTRAINT "CHK_PERIOD_DATES" CHECK (("START_DATE" <= "END_DATE"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_PERIOD_NAME" ON "PERIOD" ("NAME") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_GOAL_PROGRESS_COMPOSITE" ON "GOAL_PROGRESS" ("GOAL_ID", "MODULE_ID", "PERIOD_ID", "STAFF_ID") `
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_PROGRESS" ADD CONSTRAINT "FK_ebee84489b1c79d37f4c4cab7cc" FOREIGN KEY ("PERIOD_ID") REFERENCES "PERIOD"("PERIOD_ID") ON DELETE RESTRICT ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_MODULE" ADD CONSTRAINT "FK_b079b08e005d25756d8300a0568" FOREIGN KEY ("PERIOD_ID") REFERENCES "PERIOD"("PERIOD_ID") ON DELETE RESTRICT ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "GOAL_X_STAFF" ADD CONSTRAINT "FK_3a48e234c55c19df9fa47787522" FOREIGN KEY ("PERIOD_ID") REFERENCES "PERIOD"("PERIOD_ID") ON DELETE RESTRICT ON UPDATE NO ACTION`
    )
  }
}
