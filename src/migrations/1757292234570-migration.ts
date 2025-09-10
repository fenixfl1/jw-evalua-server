import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1757292234570 implements MigrationInterface {
  name = 'Migration1757292234570'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
    await queryRunner.query(
      `CREATE TYPE "public"."MENU_OPTION_type_enum" AS ENUM('group', 'divider', 'link')`
    )
    await queryRunner.query(
      `CREATE TABLE "MENU_OPTION" ("MENU_OPTION_ID" character varying(50) NOT NULL, "NAME" character varying(100) NOT NULL, "DESCRIPTION" character varying(250), "PATH" character varying(100), "TYPE" "public"."MENU_OPTION_type_enum", "ICON" text, "ORDER" integer NOT NULL, "PARENT_ID" character varying, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', CONSTRAINT "PK_c33923d6f156b267e8e4dfe59c3" PRIMARY KEY ("MENU_OPTION_ID"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."GOAL_scope_enum" AS ENUM('individual', 'module')`
    )
    await queryRunner.query(
      `CREATE TABLE "GOAL" ("CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "CREATED_BY" integer, "STATE" character(1) NOT NULL DEFAULT 'A', "UPDATED_AT" TIMESTAMP DEFAULT now(), "UPDATED_BY" integer, "GOAL_ID" SERIAL NOT NULL, "MODULE_ID" integer NOT NULL, "DESCRIPTION" character varying NOT NULL, "START_DATE" TIMESTAMP NOT NULL, "END_DATE" TIMESTAMP NOT NULL, "WEIGHT" integer NOT NULL, "SCOPE" "public"."GOAL_scope_enum" NOT NULL, CONSTRAINT "PK_31918bd1daf1306b0e32a329ea7" PRIMARY KEY ("GOAL_ID"))`
    )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`);
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID")`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_27488ae7e50440d4a06b585798b" PRIMARY KEY ("USER_ID", "ROLE_ID")`);
    // await queryRunner.query(
    //   `ALTER TABLE "ACTION" ADD CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac" PRIMARY KEY ("ACTION_ID")`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`);
    // await queryRunner.query(
    //   `ALTER TABLE "ACTIVITY_LOG" ADD CONSTRAINT "PK_68a56a34c121833ade7ce683435" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_4200dc942e6cdcf10228ce02684" PRIMARY KEY ("ID", "USER_ID")`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_4200dc942e6cdcf10228ce02684"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_889f66c9c59dcad8621020d62ae" PRIMARY KEY ("USER_ID", "ID", "ROLE_ID")`);
    // await queryRunner.query(`CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON "ROLES_X_USER" ("USER_ID") `);
    // await queryRunner.query(`CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON "ROLES_X_USER" ("ROLE_ID") `);
    // await queryRunner.query(
    //   `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "PERMISSION" ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES "ACTION"("ACTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTION" ADD CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE CASCADE`
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_cfb5ba942f33086e54cec026244"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "FK_6014c0ac471a029270386464b0e"`);
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
      `DROP INDEX "public"."IDX_cfb5ba942f33086e54cec02624"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6014c0ac471a029270386464b0"`
    )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_889f66c9c59dcad8621020d62ae"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_4200dc942e6cdcf10228ce02684" PRIMARY KEY ("USER_ID", "ID")`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_4200dc942e6cdcf10228ce02684"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`);
    await queryRunner.query(
      `ALTER TABLE "ACTIVITY_LOG" DROP CONSTRAINT "PK_68a56a34c121833ade7ce683435"`
    )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e334f27f4437fe561b565b0c020" PRIMARY KEY ("ROLE_ID", "ID")`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e334f27f4437fe561b565b0c020"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_889f66c9c59dcad8621020d62ae" PRIMARY KEY ("USER_ID", "ROLE_ID", "ID")`);
    await queryRunner.query(
      `ALTER TABLE "ACTION" DROP CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac"`
    )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_27488ae7e50440d4a06b585798b"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97" PRIMARY KEY ("ID")`);
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f"`
    // )
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP CONSTRAINT "PK_e0e994e4f4cd602284d12f2cf97"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "ID"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_BY"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "UPDATED_AT"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "STATE"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_BY"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" DROP COLUMN "CREATED_AT"`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "STATE" character NOT NULL DEFAULT 'A'`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "ID" SERIAL NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_BY" integer`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "UPDATED_AT" TIMESTAMP DEFAULT now()`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_BY" integer`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`DROP TABLE "GOAL"`)
    await queryRunner.query(`DROP TYPE "public"."GOAL_scope_enum"`)
    await queryRunner.query(`DROP TABLE "MENU_OPTION"`)
    await queryRunner.query(`DROP TYPE "public"."MENU_OPTION_type_enum"`)
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    // await queryRunner.query(`ALTER TABLE "ROLES_X_USER" ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
