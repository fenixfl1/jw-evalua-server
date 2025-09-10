import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
  TableUnique,
  TableCheck,
} from 'typeorm'

export class SchemaHardeningPeriodsSecurity1699999999999
  implements MigrationInterface
{
  name = 'SchemaHardeningPeriodsSecurity1699999999999'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) PERIOD table
    const hasPeriod = await queryRunner.hasTable('PERIOD')
    if (!hasPeriod) {
      await queryRunner.createTable(
        new Table({
          name: 'PERIOD',
          columns: [
            {
              name: 'PERIOD_ID',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'NAME', type: 'varchar', length: '50', isNullable: false },
            { name: 'START_DATE', type: 'date', isNullable: false },
            { name: 'END_DATE', type: 'date', isNullable: false },
            {
              name: 'TYPE',
              type: 'enum',
              enum: ['weekly', 'monthly', 'custom'],
              enumName: 'period_type_enum',
              isNullable: false,
            },
          ],
          uniques: [
            new TableUnique({ name: 'UQ_PERIOD_NAME', columnNames: ['NAME'] }),
          ],
          checks: [
            new TableCheck({
              name: 'CHK_PERIOD_DATES',
              expression: '"START_DATE" <= "END_DATE"',
            }),
          ],
        })
      )
      await queryRunner.createIndex(
        'PERIOD',
        new TableIndex({ name: 'IDX_PERIOD_NAME', columnNames: ['NAME'] })
      )
    }

    // 1b) FKs PERIOD_ID
    const addFkIfMissing = async (table: string, column: string) => {
      const fks = await queryRunner.getTable(table)
      const hasColumn = fks?.findColumnByName(column)
      if (hasColumn) {
        const hasFK = fks?.foreignKeys.some(
          (fk) =>
            fk.columnNames.includes(column) &&
            fk.referencedTableName === 'PERIOD'
        )
        if (!hasFK) {
          await queryRunner.createForeignKey(
            table,
            new TableForeignKey({
              columnNames: [column],
              referencedTableName: 'PERIOD',
              referencedColumnNames: ['PERIOD_ID'],
              onDelete: 'RESTRICT',
            })
          )
        }
      }
    }
    await addFkIfMissing('GOAL_PROGRESS', 'PERIOD_ID')
    await addFkIfMissing('GOAL_X_STAFF', 'PERIOD_ID')
    await addFkIfMissing('GOAL_X_MODULE', 'PERIOD_ID')

    // 2) USERS security
    if (await queryRunner.hasTable('USERS')) {
      const users = await queryRunner.getTable('USERS')
      // Rename PASSWORD -> PASSWORD_HASH
      if (
        users?.findColumnByName('PASSWORD') &&
        !users.findColumnByName('PASSWORD_HASH')
      ) {
        await queryRunner.renameColumn('USERS', 'PASSWORD', 'PASSWORD_HASH')
      }
      // LOGIN_COUNT to integer
      const loginCount = users?.findColumnByName('LOGIN_COUNT')
      if (loginCount && loginCount.type !== 'integer') {
        await queryRunner.changeColumn(
          'USERS',
          'LOGIN_COUNT',
          new TableColumn({
            name: 'LOGIN_COUNT',
            type: 'integer',
            isNullable: true,
          })
        )
      }
      // Unique + index on USERNAME
      const hasUq = users?.uniques.find((u) => u.name === 'UQ_USERS_USERNAME')
      if (!hasUq) {
        await queryRunner.createUniqueConstraint(
          'USERS',
          new TableUnique({
            name: 'UQ_USERS_USERNAME',
            columnNames: ['USERNAME'],
          })
        )
      }
      const hasIdx = users?.indices.find((i) => i.name === 'IDX_USERS_USERNAME')
      if (!hasIdx) {
        await queryRunner.createIndex(
          'USERS',
          new TableIndex({
            name: 'IDX_USERS_USERNAME',
            columnNames: ['USERNAME'],
          })
        )
      }
    }

    // 3) STAFF renames and checks
    if (await queryRunner.hasTable('STAFF')) {
      const staff = await queryRunner.getTable('STAFF')
      if (
        staff?.findColumnByName('BIRTH_DATA') &&
        !staff.findColumnByName('BIRTH_DATE')
      ) {
        await queryRunner.renameColumn('STAFF', 'BIRTH_DATA', 'BIRTH_DATE')
      }
      // Uniques
      if (!staff?.uniques.find((u) => u.name === 'UQ_STAFF_EMAIL')) {
        await queryRunner.createUniqueConstraint(
          'STAFF',
          new TableUnique({ name: 'UQ_STAFF_EMAIL', columnNames: ['EMAIL'] })
        )
      }
      if (
        !staff?.uniques.find((u) => u.name === 'UQ_STAFF_IDENTITY_DOCUMENT')
      ) {
        await queryRunner.createUniqueConstraint(
          'STAFF',
          new TableUnique({
            name: 'UQ_STAFF_IDENTITY_DOCUMENT',
            columnNames: ['IDENTITY_DOCUMENT'],
          })
        )
      }
      // Gender enum already handled in entity; ensure check exists
      if (!staff?.checks.find((c) => c.name === 'CHK_STAFF_GENDER')) {
        await queryRunner.createCheckConstraint(
          'STAFF',
          new TableCheck({
            name: 'CHK_STAFF_GENDER',
            expression: '"GENDER" IN (\'M\',\'F\',\'O\')',
          }),
        )
      }
      if (
        !staff?.checks.find((c) => c.name === 'CHK_STAFF_IDENTITY_DOCUMENT')
      ) {
        await queryRunner.createCheckConstraint(
          'STAFF',
          new TableCheck({
            name: 'CHK_STAFF_IDENTITY_DOCUMENT',
            expression: '"IDENTITY_DOCUMENT" ~ \'^[0-9]{11}$\'',
          }),
        )
      }
      // Add UPDATED_AT/BY if missing
      if (!staff?.findColumnByName('UPDATED_AT')) {
        await queryRunner.addColumn(
          'STAFF',
          new TableColumn({
            name: 'UPDATED_AT',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          })
        )
      }
      if (!staff?.findColumnByName('UPDATED_BY')) {
        await queryRunner.addColumn(
          'STAFF',
          new TableColumn({
            name: 'UPDATED_BY',
            type: 'integer',
            isNullable: true,
          })
        )
      }
    }

    // 5) BUSINESS logo
    if (await queryRunner.hasTable('BUSINESS')) {
      const biz = await queryRunner.getTable('BUSINESS')
      const logo = biz?.findColumnByName('LOGO')
      if (logo && !logo.isNullable) {
        await queryRunner.changeColumn(
          'BUSINESS',
          'LOGO',
          new TableColumn({ name: 'LOGO', type: 'bytea', isNullable: true })
        )
      }
      if (!biz?.findColumnByName('LOGO_URL')) {
        await queryRunner.addColumn(
          'BUSINESS',
          new TableColumn({ name: 'LOGO_URL', type: 'text', isNullable: true })
        )
      }
      // Add audit columns if missing
      if (!biz?.findColumnByName('CREATED_AT')) {
        await queryRunner.addColumn(
          'BUSINESS',
          new TableColumn({
            name: 'CREATED_AT',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          })
        )
      }
      if (!biz?.findColumnByName('CREATED_BY')) {
        await queryRunner.addColumn(
          'BUSINESS',
          new TableColumn({
            name: 'CREATED_BY',
            type: 'integer',
            isNullable: true,
          })
        )
      }
      if (!biz?.findColumnByName('UPDATED_AT')) {
        await queryRunner.addColumn(
          'BUSINESS',
          new TableColumn({
            name: 'UPDATED_AT',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          })
        )
      }
      if (!biz?.findColumnByName('UPDATED_BY')) {
        await queryRunner.addColumn(
          'BUSINESS',
          new TableColumn({
            name: 'UPDATED_BY',
            type: 'integer',
            isNullable: true,
          })
        )
      }
    }

    // 6) Indexes and uniques
    // MenuOption: (PARENT_ID, ORDER)
    if (await queryRunner.hasTable('MENU_OPTION')) {
      const mo = await queryRunner.getTable('MENU_OPTION')
      if (!mo?.indices.find((i) => i.name === 'IDX_MENU_OPTION_PARENT_ORDER')) {
        await queryRunner.createIndex(
          'MENU_OPTION',
          new TableIndex({
            name: 'IDX_MENU_OPTION_PARENT_ORDER',
            columnNames: ['PARENT_ID', 'ORDER'],
          })
        )
      }
      if (!mo?.uniques.find((u) => u.name === 'UQ_MENU_OPTION_PARENT_ORDER')) {
        await queryRunner.createUniqueConstraint(
          'MENU_OPTION',
          new TableUnique({
            name: 'UQ_MENU_OPTION_PARENT_ORDER',
            columnNames: ['PARENT_ID', 'ORDER'],
          })
        )
      }
      // add UPDATED_* to MENU_OPTION if missing (audit)
      if (!mo?.findColumnByName('UPDATED_AT')) {
        await queryRunner.addColumn(
          'MENU_OPTION',
          new TableColumn({
            name: 'UPDATED_AT',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          })
        )
      }
      if (!mo?.findColumnByName('UPDATED_BY')) {
        await queryRunner.addColumn(
          'MENU_OPTION',
          new TableColumn({
            name: 'UPDATED_BY',
            type: 'integer',
            isNullable: true,
          })
        )
      }
    }

    // ActivityLog: ip + userAgent + index
    if (await queryRunner.hasTable('ACTIVITY_LOG')) {
      const al = await queryRunner.getTable('ACTIVITY_LOG')
      if (!al?.findColumnByName('IP')) {
        await queryRunner.addColumn(
          'ACTIVITY_LOG',
          new TableColumn({ name: 'IP', type: 'inet', isNullable: true })
        )
      }
      if (!al?.findColumnByName('USER_AGENT')) {
        await queryRunner.addColumn(
          'ACTIVITY_LOG',
          new TableColumn({
            name: 'USER_AGENT',
            type: 'text',
            isNullable: true,
          })
        )
      }
      if (
        !al?.indices.find((i) => i.name === 'IDX_ACTIVITY_LOG_USER_CREATED_AT')
      ) {
        await queryRunner.createIndex(
          'ACTIVITY_LOG',
          new TableIndex({
            name: 'IDX_ACTIVITY_LOG_USER_CREATED_AT',
            columnNames: ['USER_ID', 'CREATED_AT'],
          })
        )
      }
    }

    // GoalProgress composite index
    if (await queryRunner.hasTable('GOAL_PROGRESS')) {
      const gp = await queryRunner.getTable('GOAL_PROGRESS')
      if (!gp?.indices.find((i) => i.name === 'IDX_GOAL_PROGRESS_COMPOSITE')) {
        await queryRunner.createIndex(
          'GOAL_PROGRESS',
          new TableIndex({
            name: 'IDX_GOAL_PROGRESS_COMPOSITE',
            columnNames: ['GOAL_ID', 'PERIOD_ID', 'MODULE_ID', 'STAFF_ID'],
          })
        )
      }
    }

    // MENU_OPTIONS_X_ROLES composite PK
    if (await queryRunner.hasTable('MENU_OPTIONS_X_ROLES')) {
      const mxr = await queryRunner.getTable('MENU_OPTIONS_X_ROLES')
      if (mxr && !mxr.columns.find((c) => c.isPrimary)) {
        // ensure both columns exist
        if (!mxr.findColumnByName('MENU_OPTION_ID')) {
          await queryRunner.addColumn(
            'MENU_OPTIONS_X_ROLES',
            new TableColumn({
              name: 'MENU_OPTION_ID',
              type: 'varchar',
              length: '50',
            })
          )
        }
        if (!mxr.findColumnByName('ROLE_ID')) {
          await queryRunner.addColumn(
            'MENU_OPTIONS_X_ROLES',
            new TableColumn({ name: 'ROLE_ID', type: 'integer' })
          )
        }
        // De-duplicate rows to allow PK creation
        await queryRunner.query(`
          DELETE FROM "MENU_OPTIONS_X_ROLES" a
          USING "MENU_OPTIONS_X_ROLES" b
          WHERE a.ctid < b.ctid
            AND a."MENU_OPTION_ID" = b."MENU_OPTION_ID"
            AND a."ROLE_ID" = b."ROLE_ID";
        `)
        await queryRunner.createPrimaryKey('MENU_OPTIONS_X_ROLES', [
          'MENU_OPTION_ID',
          'ROLE_ID',
        ])
      }
    }

    // 9) KPI views (optional)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW v_kpi_efficiency_daily AS
      SELECT gp."GOAL_ID", gp."PERIOD_ID", gp."ACTUAL_VALUE"
      FROM "GOAL_PROGRESS" gp;
    `)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW v_kpi_efficiency_weekly AS
      SELECT gp."GOAL_ID", gp."PERIOD_ID", gp."ACTUAL_VALUE"
      FROM "GOAL_PROGRESS" gp
      JOIN "PERIOD" p ON p."PERIOD_ID" = gp."PERIOD_ID" AND p."TYPE" = 'weekly';
    `)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW v_kpi_goal_achievement AS
      SELECT gp."GOAL_ID", gp."PERIOD_ID", gp."ACTUAL_VALUE"
      FROM "GOAL_PROGRESS" gp;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop KPI views
    await queryRunner.query('DROP VIEW IF EXISTS v_kpi_goal_achievement')
    await queryRunner.query('DROP VIEW IF EXISTS v_kpi_efficiency_weekly')
    await queryRunner.query('DROP VIEW IF EXISTS v_kpi_efficiency_daily')

    // MENU_OPTIONS_X_ROLES composite PK
    if (await queryRunner.hasTable('MENU_OPTIONS_X_ROLES')) {
      const mxr = await queryRunner.getTable('MENU_OPTIONS_X_ROLES')
      if (mxr?.primaryColumns?.length) {
        await queryRunner.dropPrimaryKey('MENU_OPTIONS_X_ROLES')
      }
    }

    // GoalProgress index
    if (await queryRunner.hasTable('GOAL_PROGRESS')) {
      const gp = await queryRunner.getTable('GOAL_PROGRESS')
      if (gp?.indices.find((i) => i.name === 'IDX_GOAL_PROGRESS_COMPOSITE')) {
        await queryRunner.dropIndex(
          'GOAL_PROGRESS',
          'IDX_GOAL_PROGRESS_COMPOSITE'
        )
      }
    }

    // ActivityLog
    if (await queryRunner.hasTable('ACTIVITY_LOG')) {
      const al = await queryRunner.getTable('ACTIVITY_LOG')
      if (
        al?.indices.find((i) => i.name === 'IDX_ACTIVITY_LOG_USER_CREATED_AT')
      ) {
        await queryRunner.dropIndex(
          'ACTIVITY_LOG',
          'IDX_ACTIVITY_LOG_USER_CREATED_AT'
        )
      }
      if (al?.findColumnByName('IP')) {
        await queryRunner.dropColumn('ACTIVITY_LOG', 'IP')
      }
      if (al?.findColumnByName('USER_AGENT')) {
        await queryRunner.dropColumn('ACTIVITY_LOG', 'USER_AGENT')
      }
    }

    // MENU_OPTION indexes/uniques and audit
    if (await queryRunner.hasTable('MENU_OPTION')) {
      const mo = await queryRunner.getTable('MENU_OPTION')
      if (mo?.uniques.find((u) => u.name === 'UQ_MENU_OPTION_PARENT_ORDER')) {
        await queryRunner.dropUniqueConstraint(
          'MENU_OPTION',
          'UQ_MENU_OPTION_PARENT_ORDER'
        )
      }
      if (mo?.indices.find((i) => i.name === 'IDX_MENU_OPTION_PARENT_ORDER')) {
        await queryRunner.dropIndex(
          'MENU_OPTION',
          'IDX_MENU_OPTION_PARENT_ORDER'
        )
      }
      if (mo?.findColumnByName('UPDATED_AT')) {
        await queryRunner.dropColumn('MENU_OPTION', 'UPDATED_AT')
      }
      if (mo?.findColumnByName('UPDATED_BY')) {
        await queryRunner.dropColumn('MENU_OPTION', 'UPDATED_BY')
      }
    }

    // BUSINESS revert audit and logo changes
    if (await queryRunner.hasTable('BUSINESS')) {
      const biz = await queryRunner.getTable('BUSINESS')
      if (biz?.findColumnByName('LOGO_URL'))
        await queryRunner.dropColumn('BUSINESS', 'LOGO_URL')
      const logo = biz?.findColumnByName('LOGO')
      if (logo && logo.isNullable) {
        await queryRunner.changeColumn(
          'BUSINESS',
          'LOGO',
          new TableColumn({ name: 'LOGO', type: 'bytea', isNullable: false })
        )
      }
      if (biz?.findColumnByName('UPDATED_BY'))
        await queryRunner.dropColumn('BUSINESS', 'UPDATED_BY')
      if (biz?.findColumnByName('UPDATED_AT'))
        await queryRunner.dropColumn('BUSINESS', 'UPDATED_AT')
      if (biz?.findColumnByName('CREATED_BY'))
        await queryRunner.dropColumn('BUSINESS', 'CREATED_BY')
      if (biz?.findColumnByName('CREATED_AT'))
        await queryRunner.dropColumn('BUSINESS', 'CREATED_AT')
    }

    // STAFF checks and rename revert
    if (await queryRunner.hasTable('STAFF')) {
      const staff = await queryRunner.getTable('STAFF')
      if (staff?.checks.find((c) => c.name === 'CHK_STAFF_IDENTITY_DOCUMENT')) {
        await queryRunner.dropCheckConstraint(
          'STAFF',
          'CHK_STAFF_IDENTITY_DOCUMENT'
        )
      }
      if (staff?.checks.find((c) => c.name === 'CHK_STAFF_GENDER')) {
        await queryRunner.dropCheckConstraint('STAFF', 'CHK_STAFF_GENDER')
      }
      if (staff?.uniques.find((u) => u.name === 'UQ_STAFF_IDENTITY_DOCUMENT')) {
        await queryRunner.dropUniqueConstraint(
          'STAFF',
          'UQ_STAFF_IDENTITY_DOCUMENT'
        )
      }
      if (staff?.uniques.find((u) => u.name === 'UQ_STAFF_EMAIL')) {
        await queryRunner.dropUniqueConstraint('STAFF', 'UQ_STAFF_EMAIL')
      }
      if (staff?.findColumnByName('UPDATED_BY'))
        await queryRunner.dropColumn('STAFF', 'UPDATED_BY')
      if (staff?.findColumnByName('UPDATED_AT'))
        await queryRunner.dropColumn('STAFF', 'UPDATED_AT')
      if (
        staff?.findColumnByName('BIRTH_DATE') &&
        !staff.findColumnByName('BIRTH_DATA')
      ) {
        await queryRunner.renameColumn('STAFF', 'BIRTH_DATE', 'BIRTH_DATA')
      }
    }

    // USERS revert
    if (await queryRunner.hasTable('USERS')) {
      const users = await queryRunner.getTable('USERS')
      if (users?.indices.find((i) => i.name === 'IDX_USERS_USERNAME')) {
        await queryRunner.dropIndex('USERS', 'IDX_USERS_USERNAME')
      }
      if (users?.uniques.find((u) => u.name === 'UQ_USERS_USERNAME')) {
        await queryRunner.dropUniqueConstraint('USERS', 'UQ_USERS_USERNAME')
      }
      const loginCount = users?.findColumnByName('LOGIN_COUNT')
      if (loginCount && loginCount.type !== 'varchar') {
        await queryRunner.changeColumn(
          'USERS',
          'LOGIN_COUNT',
          new TableColumn({
            name: 'LOGIN_COUNT',
            type: 'varchar',
            isNullable: true,
          })
        )
      }
      if (
        users?.findColumnByName('PASSWORD_HASH') &&
        !users.findColumnByName('PASSWORD')
      ) {
        await queryRunner.renameColumn('USERS', 'PASSWORD_HASH', 'PASSWORD')
      }
    }

    // Drop FKs to PERIOD
    const dropFkIfExists = async (table: string, column: string) => {
      const tbl = await queryRunner.getTable(table)
      const fk = tbl?.foreignKeys.find(
        (fk) =>
          fk.columnNames.includes(column) && fk.referencedTableName === 'PERIOD'
      )
      if (fk) await queryRunner.dropForeignKey(table, fk)
    }
    await dropFkIfExists('GOAL_PROGRESS', 'PERIOD_ID')
    await dropFkIfExists('GOAL_X_STAFF', 'PERIOD_ID')
    await dropFkIfExists('GOAL_X_MODULE', 'PERIOD_ID')

    // Drop PERIOD
    if (await queryRunner.hasTable('PERIOD')) {
      await queryRunner.dropTable('PERIOD')
      // enum type may linger, attempt drop
      try {
        await queryRunner.query('DROP TYPE IF EXISTS "period_type_enum"')
      } catch {}
    }
  }
}
