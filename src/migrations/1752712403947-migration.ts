import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1752712403947 implements MigrationInterface {
  name = 'Migration1752712403947'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_b963f21f99b6634c60735af721e"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "STATE"`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "ID"`
    // )
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "STAFF_ID" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "IS_ACTIVE" boolean NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_BY" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "STATE" character(1) NOT NULL DEFAULT 'A'`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "ID" integer NOT NULL`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID")`
    // )
    // await queryRunner.query(`ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_b3d8c741a86cf2c57419df4ceba"`);
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_cb113d88472c3cb414cb1f7a4ff" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_cb113d88472c3cb414cb1f7a4ff"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "MENU_OPTION_ID" SET NOT NULL`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_24113b433feb61cb23c7032e9ec" PRIMARY KEY ("ID", "MENU_OPTION_ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "ROLE_ID" SET NOT NULL`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_24113b433feb61cb23c7032e9ec"`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_b3d8c741a86cf2c57419df4ceba" PRIMARY KEY ("MENU_OPTION_ID", "ID", "ROLE_ID")`
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON "MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID") `
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON "MENU_OPTIONS_X_ROLES" ("ROLE_ID") `
    // )
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8" FOREIGN KEY ("STAFF_ID") REFERENCES "STAFF"("STAFF_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_b963f21f99b6634c60735af721e" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "FK_b963f21f99b6634c60735af721e"`
    )
    await queryRunner.query(
      `ALTER TABLE "USERS" DROP CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c7ac3fef525331bd30141dafb"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d3bd9bead05f4d2521b2ffe1a8"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_b3d8c741a86cf2c57419df4ceba"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_24113b433feb61cb23c7032e9ec" PRIMARY KEY ("MENU_OPTION_ID", "ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "ROLE_ID" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_24113b433feb61cb23c7032e9ec"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ALTER COLUMN "MENU_OPTION_ID" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`
    )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_cb113d88472c3cb414cb1f7a4ff" PRIMARY KEY ("ROLE_ID", "ID")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_cb113d88472c3cb414cb1f7a4ff"`
    // )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_b3d8c741a86cf2c57419df4ceba" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID", "ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "ID"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "STATE"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_BY"`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" DROP COLUMN "CREATED_AT"`
    )
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "IS_ACTIVE"`)
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "STAFF_ID"`)
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "ID" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "PK_df5f8bfad59fbfa993b0a218293" PRIMARY KEY ("ID")`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "STATE" character NOT NULL DEFAULT 'A'`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_BY" integer NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES "ROLE"("ROLE_ID") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES "MENU_OPTION"("MENU_OPTION_ID") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "MENU_OPTIONS_X_ROLES" ADD CONSTRAINT "FK_b963f21f99b6634c60735af721e" FOREIGN KEY ("CREATED_BY") REFERENCES "USERS"("USER_ID") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
