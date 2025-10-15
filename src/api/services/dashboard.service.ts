import { BaseService, CatchServiceError } from './base.service'
import { ApiResponse, Metadata, Pagination } from '@src/types/api.types'
import { preparePostgresQuery } from '@src/api/middlewares/prepare-postgres-query'
import { getQueryMetadata, queryRunner } from '@src/helpers/query-utils'

interface DashboardSummaryFilters {
  moduleId?: number
  periodStart?: number
  periodEnd?: number
}

type BaseDashboardKpis = Omit<
  DashboardKpis,
  'activeGoals' | 'goalComplianceAverage'
>

interface DashboardKpis {
  totalStaff: number
  activeModules: number
  newStaffLast30Days: number
  evaluationsCompleted: number
  evaluationsPending: number
  evaluationsAverageScore: number | null
  activeGoals: number
  goalComplianceAverage: number | null
}

interface EvaluationTrendPoint {
  period: number
  label: string
  total: number
  completed: number
  pending: number
  averageScore: number | null
  lastUpdatedAt: string | null
}

interface ModuleEvaluationSummary {
  moduleId: number | null
  moduleName: string
  total: number
  completed: number
  pending: number
  averageScore: number | null
}

interface ModuleGoalCompliance {
  moduleId: number | null
  moduleName: string
  targetValue: number
  actualValue: number
  compliance: number | null
}

interface StaffDistributionEntry {
  moduleId: number | null
  moduleName: string
  staffCount: number
}

interface RecentEvaluation {
  evaluationId: number
  staffName: string
  moduleName: string
  period: number
  periodLabel: string
  overallScore: number | null
  updatedAt: string | null
}

interface DashboardFilterOptions {
  modules: { moduleId: number; description: string }[]
  periods: number[]
}

interface GoalComplianceSummary {
  items: ModuleGoalCompliance[]
  averageCompliance: number | null
  activeGoals: number
}

interface DashboardSummary {
  kpis: DashboardKpis
  evaluationsTrend: EvaluationTrendPoint[]
  evaluationsByModule: ModuleEvaluationSummary[]
  goalComplianceByModule: ModuleGoalCompliance[]
  staffDistribution: StaffDistributionEntry[]
  recentEvaluations: RecentEvaluation[]
  filters: DashboardFilterOptions
}

interface DashboardActivityFilters {
  limit: number
  offset: number
  action?: 'INSERT' | 'UPDATE' | 'DELETE'
  model?: string
  userId?: number
  dateFrom?: Date
  dateTo?: Date
}

interface ActivityLogEntry {
  id: number
  action: string
  model: string
  objectId: unknown
  changes: Record<string, unknown> | null
  createdAt: string
  userId: number | null
  username: string | null
  staffName: string | null
}

interface ActivityLogResult {
  items: ActivityLogEntry[]
  metadata: Metadata
}

export class DashboardService extends BaseService {
  @CatchServiceError()
  async getSummary(
    filters: DashboardSummaryFilters
  ): Promise<ApiResponse<DashboardSummary>> {
    const normalizedFilters = this.normalizeFilters(filters)

    const [
      baseKpis,
      trend,
      evaluationsByModule,
      goalSummary,
      staffDistribution,
      recentEvaluations,
      filterOptions,
    ] = await Promise.all([
      this.getKpis(normalizedFilters),
      this.getEvaluationTrend(normalizedFilters),
      this.getEvaluationsByModule(normalizedFilters),
      this.getGoalComplianceSummary(normalizedFilters),
      this.getStaffDistribution(normalizedFilters),
      this.getRecentEvaluations(normalizedFilters),
      this.getFilterOptions(),
    ])

    const kpis: DashboardKpis = {
      ...baseKpis,
      activeGoals: goalSummary.activeGoals,
      goalComplianceAverage: goalSummary.averageCompliance,
    }

    const data: DashboardSummary = {
      kpis,
      evaluationsTrend: trend,
      evaluationsByModule,
      goalComplianceByModule: goalSummary.items,
      staffDistribution,
      recentEvaluations,
      filters: filterOptions,
    }

    return this.success({ data })
  }

  @CatchServiceError()
  async getActivityLog(
    filters: DashboardActivityFilters
  ): Promise<ApiResponse<{ items: ActivityLogEntry[] }>> {
    const { items, metadata } = await this.fetchActivityLog(filters)

    return this.success({
      data: { items },
      metadata,
    })
  }

  private normalizeFilters(
    filters: DashboardSummaryFilters
  ): DashboardSummaryFilters {
    const normalized: DashboardSummaryFilters = { ...filters }

    if (
      normalized.periodStart !== undefined &&
      normalized.periodEnd !== undefined &&
      normalized.periodStart > normalized.periodEnd
    ) {
      const { periodStart } = normalized
      normalized.periodStart = normalized.periodEnd
      normalized.periodEnd = periodStart
    }

    return normalized
  }

  private buildEvaluationWhereClause(filters: DashboardSummaryFilters): {
    clause: string
    params: Record<string, unknown>
  } {
    const conditions: string[] = [`e."STATE" = 'A'`]
    const params: Record<string, unknown> = {}

    if (filters.moduleId) {
      conditions.push('e."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    if (filters.periodStart) {
      conditions.push('e."PERIOD" >= :periodStart')
      params.periodStart = filters.periodStart
    }

    if (filters.periodEnd) {
      conditions.push('e."PERIOD" <= :periodEnd')
      params.periodEnd = filters.periodEnd
    }

    return { clause: `WHERE ${conditions.join(' AND ')}`, params }
  }

  private buildStaffWhereClause(filters: DashboardSummaryFilters): {
    clause: string
    params: Record<string, unknown>
  } {
    const conditions: string[] = [`s."STATE" = 'A'`]
    const params: Record<string, unknown> = {}

    if (filters.moduleId) {
      conditions.push('s."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    return { clause: `WHERE ${conditions.join(' AND ')}`, params }
  }


  private buildModuleWhereClause(filters: DashboardSummaryFilters): {
    clause: string
    params: Record<string, unknown>
  } {
    const conditions: string[] = [`m."STATE" = 'A'`]
    const params: Record<string, unknown> = {}

    if (filters.moduleId) {
      conditions.push('m."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    return { clause: `WHERE ${conditions.join(' AND ')}`, params }
  }

  private buildGoalAssignmentWhere(filters: DashboardSummaryFilters): {
    clause: string
    params: Record<string, unknown>
  } {
    const conditions: string[] = [`gm."STATE" = 'A'`, `g."STATE" = 'A'`]
    const params: Record<string, unknown> = {}

    if (filters.moduleId) {
      conditions.push('gm."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    if (filters.periodStart) {
      conditions.push('gm."PERIOD" >= :periodStart')
      params.periodStart = filters.periodStart
    }

    if (filters.periodEnd) {
      conditions.push('gm."PERIOD" <= :periodEnd')
      params.periodEnd = filters.periodEnd
    }

    return { clause: `WHERE ${conditions.join(' AND ')}`, params }
  }

  private buildGoalProgressWhere(filters: DashboardSummaryFilters): {
    clause: string
    params: Record<string, unknown>
  } {
    const conditions: string[] = [`gp."STATE" = 'A'`, 'gp."SCOPE" = \'module\'']
    const params: Record<string, unknown> = {}

    if (filters.moduleId) {
      conditions.push('gp."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    if (filters.periodStart) {
      conditions.push('gp."PERIOD" >= :periodStart')
      params.periodStart = filters.periodStart
    }

    if (filters.periodEnd) {
      conditions.push('gp."PERIOD" <= :periodEnd')
      params.periodEnd = filters.periodEnd
    }

    return { clause: `WHERE ${conditions.join(' AND ')}`, params }
  }

  private async getKpis(
    filters: DashboardSummaryFilters
  ): Promise<BaseDashboardKpis> {
    const staffWhere = this.buildStaffWhereClause(filters)
    const staffSql = `
      SELECT
        COUNT(*)::int AS "TOTAL",
        COUNT(*) FILTER (
          WHERE s."CREATED_AT" IS NOT NULL
            AND s."CREATED_AT" >= NOW() - INTERVAL '30 days'
        )::int AS "NEW_LAST_30"
      FROM public."STAFF" s
      ${staffWhere.clause}
    `
    const staffQuery = preparePostgresQuery(staffSql, staffWhere.params)
    const [staffRow] = await queryRunner<{
      TOTAL: number
      NEW_LAST_30: number
    }>(staffQuery.query, staffQuery.values)

    const moduleWhere = this.buildModuleWhereClause(filters)
    const moduleSql = `
      SELECT COUNT(*)::int AS "COUNT"
      FROM public."MODULE" m
      ${moduleWhere.clause}
    `
    const moduleQuery = preparePostgresQuery(moduleSql, moduleWhere.params)
    const [moduleRow] = await queryRunner<{ COUNT: number }>(
      moduleQuery.query,
      moduleQuery.values
    )

    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const evaluationSql = `
      SELECT
        COUNT(*)::int AS "TOTAL",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NOT NULL THEN 1 ELSE 0 END)::int AS "COMPLETED",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NULL THEN 1 ELSE 0 END)::int AS "PENDING",
        AVG(e."OVERALL_SCORE")::numeric AS "AVERAGE_SCORE"
      FROM public."EVALUATION" e
      ${evaluationWhere.clause}
    `
    const evaluationQuery = preparePostgresQuery(
      evaluationSql,
      evaluationWhere.params
    )
    const [evaluationRow] = await queryRunner<{
      TOTAL: number
      COMPLETED: number
      PENDING: number
      AVERAGE_SCORE: string | number | null
    }>(evaluationQuery.query, evaluationQuery.values)

    const averageScore =
      evaluationRow?.AVERAGE_SCORE !== null &&
      evaluationRow?.AVERAGE_SCORE !== undefined
        ? Number(Number(evaluationRow.AVERAGE_SCORE).toFixed(2))
        : null

    return {
      totalStaff: Number(staffRow?.TOTAL ?? 0),
      newStaffLast30Days: Number(staffRow?.NEW_LAST_30 ?? 0),
      activeModules: Number(moduleRow?.COUNT ?? 0),
      evaluationsCompleted: Number(evaluationRow?.COMPLETED ?? 0),
      evaluationsPending: Number(evaluationRow?.PENDING ?? 0),
      evaluationsAverageScore: averageScore,
    }
  }

  private async getEvaluationTrend(
    filters: DashboardSummaryFilters
  ): Promise<EvaluationTrendPoint[]> {
    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const trendSql = `
      SELECT
        e."PERIOD" AS "PERIOD",
        COUNT(*)::int AS "TOTAL",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NOT NULL THEN 1 ELSE 0 END)::int AS "COMPLETED",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NULL THEN 1 ELSE 0 END)::int AS "PENDING",
        AVG(e."OVERALL_SCORE")::numeric AS "AVERAGE",
        MAX(COALESCE(e."UPDATED_AT", e."CREATED_AT")) AS "LAST_UPDATE"
      FROM public."EVALUATION" e
      ${evaluationWhere.clause}
      GROUP BY e."PERIOD"
      ORDER BY e."PERIOD" DESC
      LIMIT 6
    `

    const trendQuery = preparePostgresQuery(trendSql, evaluationWhere.params)
    const rows = await queryRunner<{
      PERIOD: number
      TOTAL: number
      COMPLETED: number
      PENDING: number
      AVERAGE: string | number | null
      LAST_UPDATE: Date | null
    }>(trendQuery.query, trendQuery.values)

    const parsed = rows
      .map((row) => {
        const average =
          row.AVERAGE !== null && row.AVERAGE !== undefined
            ? Number(Number(row.AVERAGE).toFixed(2))
            : null

        return {
          period: Number(row.PERIOD),
          label: this.formatPeriodLabel(Number(row.PERIOD)),
          total: Number(row.TOTAL ?? 0),
          completed: Number(row.COMPLETED ?? 0),
          pending: Number(row.PENDING ?? 0),
          averageScore: average,
          lastUpdatedAt: row.LAST_UPDATE
            ? new Date(row.LAST_UPDATE).toISOString()
            : null,
        }
      })
      .sort((a, b) => a.period - b.period)

    return parsed
  }

  private async getEvaluationsByModule(
    filters: DashboardSummaryFilters
  ): Promise<ModuleEvaluationSummary[]> {
    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const sql = `
      SELECT
        e."MODULE_ID" AS "MODULE_ID",
        m."DESCRIPTION" AS "MODULE_NAME",
        COUNT(*)::int AS "TOTAL",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NOT NULL THEN 1 ELSE 0 END)::int AS "COMPLETED",
        SUM(CASE WHEN e."OVERALL_SCORE" IS NULL THEN 1 ELSE 0 END)::int AS "PENDING",
        AVG(e."OVERALL_SCORE")::numeric AS "AVERAGE"
      FROM public."EVALUATION" e
      LEFT JOIN public."MODULE" m ON m."MODULE_ID" = e."MODULE_ID"
      ${evaluationWhere.clause}
      GROUP BY e."MODULE_ID", m."DESCRIPTION"
      ORDER BY m."DESCRIPTION" NULLS LAST
    `
    const query = preparePostgresQuery(sql, evaluationWhere.params)
    const rows = await queryRunner<{
      MODULE_ID: number | null
      MODULE_NAME: string | null
      TOTAL: number
      COMPLETED: number
      PENDING: number
      AVERAGE: string | number | null
    }>(query.query, query.values)

    return rows.map((row) => {
      const average =
        row.AVERAGE !== null && row.AVERAGE !== undefined
          ? Number(Number(row.AVERAGE).toFixed(2))
          : null

      return {
        moduleId: row.MODULE_ID !== null ? Number(row.MODULE_ID) : null,
        moduleName: this.normalizeModuleName(row.MODULE_NAME),
        total: Number(row.TOTAL ?? 0),
        completed: Number(row.COMPLETED ?? 0),
        pending: Number(row.PENDING ?? 0),
        averageScore: average,
      }
    })
  }

  private async getGoalComplianceSummary(
    filters: DashboardSummaryFilters
  ): Promise<GoalComplianceSummary> {
    const assignmentWhere = this.buildGoalAssignmentWhere(filters)
    const progressWhere = this.buildGoalProgressWhere(filters)

    const combinedParams = {
      ...assignmentWhere.params,
      ...progressWhere.params,
    }

    const sql = `
      WITH TARGET AS (
        SELECT
          gm."MODULE_ID",
          gm."GOAL_ID",
          gm."PERIOD",
          SUM(gm."TARGET_VALUE") AS "TARGET_VALUE"
        FROM public."GOAL_X_MODULE" gm
        INNER JOIN public."GOAL" g ON g."GOAL_ID" = gm."GOAL_ID"
        ${assignmentWhere.clause}
        GROUP BY gm."MODULE_ID", gm."GOAL_ID", gm."PERIOD"
      ),
      PROGRESS AS (
        SELECT
          gp."MODULE_ID",
          gp."GOAL_ID",
          gp."PERIOD",
          SUM(gp."ACTUAL_VALUE") AS "ACTUAL_VALUE"
        FROM public."GOAL_PROGRESS" gp
        ${progressWhere.clause}
        GROUP BY gp."MODULE_ID", gp."GOAL_ID", gp."PERIOD"
      ),
      COMBINED AS (
        SELECT
          COALESCE(t."MODULE_ID", p."MODULE_ID") AS "MODULE_ID",
          COALESCE(t."GOAL_ID", p."GOAL_ID") AS "GOAL_ID",
          COALESCE(t."PERIOD", p."PERIOD") AS "PERIOD",
          COALESCE(t."TARGET_VALUE", 0) AS "TARGET_VALUE",
          COALESCE(p."ACTUAL_VALUE", 0) AS "ACTUAL_VALUE"
        FROM TARGET t
        FULL OUTER JOIN PROGRESS p
          ON p."GOAL_ID" = t."GOAL_ID"
         AND p."MODULE_ID" IS NOT DISTINCT FROM t."MODULE_ID"
         AND p."PERIOD" IS NOT DISTINCT FROM t."PERIOD"
      )
      SELECT
        c."MODULE_ID",
        m."DESCRIPTION" AS "MODULE_NAME",
        SUM(c."TARGET_VALUE") AS "TARGET_VALUE",
        SUM(c."ACTUAL_VALUE") AS "ACTUAL_VALUE",
        CASE
          WHEN SUM(c."TARGET_VALUE") = 0 THEN NULL
          ELSE ROUND(
            LEAST(
              SUM(c."ACTUAL_VALUE") / NULLIF(SUM(c."TARGET_VALUE"), 0) * 100,
              100
            )::numeric,
            2
          )
        END AS "COMPLIANCE"
      FROM COMBINED c
      LEFT JOIN public."MODULE" m ON m."MODULE_ID" = c."MODULE_ID"
      GROUP BY c."MODULE_ID", m."DESCRIPTION"
      ORDER BY m."DESCRIPTION" NULLS LAST
    `

    const query = preparePostgresQuery(sql, combinedParams)
    const rows = await queryRunner<{
      MODULE_ID: number | null
      MODULE_NAME: string | null
      TARGET_VALUE: string | number | null
      ACTUAL_VALUE: string | number | null
      COMPLIANCE: string | number | null
    }>(query.query, query.values)

    const items = rows.map((row) => {
      const target = Number(row.TARGET_VALUE ?? 0)
      const actual = Number(row.ACTUAL_VALUE ?? 0)
      const compliance =
        row.COMPLIANCE !== null && row.COMPLIANCE !== undefined
          ? Number(Number(row.COMPLIANCE).toFixed(2))
          : null

      return {
        moduleId: row.MODULE_ID !== null ? Number(row.MODULE_ID) : null,
        moduleName: this.normalizeModuleName(row.MODULE_NAME),
        targetValue: target,
        actualValue: actual,
        compliance,
      }
    })

    const averageCompliance = this.calculateAverageCompliance(items)
    const activeGoals = await this.getActiveGoalCount(filters)

    return {
      items,
      averageCompliance,
      activeGoals,
    }
  }

  private calculateAverageCompliance(
    items: ModuleGoalCompliance[]
  ): number | null {
    const compliances = items
      .map((item) => item.compliance)
      .filter(
        (value): value is number => value !== null && !Number.isNaN(value)
      )

    if (!compliances.length) {
      return null
    }

    const sum = compliances.reduce((acc, value) => acc + value, 0)
    return Number((sum / compliances.length).toFixed(2))
  }

  private async getActiveGoalCount(
    filters: DashboardSummaryFilters
  ): Promise<number> {
    if (!filters.moduleId && !filters.periodStart && !filters.periodEnd) {
      const sql = `
        SELECT COUNT(*)::int AS "COUNT"
        FROM public."GOAL" g
        WHERE g."STATE" = 'A'
      `
      const [row] = await queryRunner<{ COUNT: number }>(sql)
      return Number(row?.COUNT ?? 0)
    }

    const assignmentWhere = this.buildGoalAssignmentWhere(filters)
    const sql = `
      SELECT COUNT(DISTINCT gm."GOAL_ID")::int AS "COUNT"
      FROM public."GOAL_X_MODULE" gm
      INNER JOIN public."GOAL" g ON g."GOAL_ID" = gm."GOAL_ID"
      ${assignmentWhere.clause}
    `
    const query = preparePostgresQuery(sql, assignmentWhere.params)
    const [row] = await queryRunner<{ COUNT: number }>(
      query.query,
      query.values
    )

    return Number(row?.COUNT ?? 0)
  }

  private async getStaffDistribution(
    filters: DashboardSummaryFilters
  ): Promise<StaffDistributionEntry[]> {
    const params: Record<string, unknown> = {}
    const conditions: string[] = []

    if (filters.moduleId) {
      conditions.push('sel."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    const sql = `
      WITH assignments AS (
        SELECT
          s."STAFF_ID",
          sxm."MODULE_ID",
          sxm."STATE" AS "MODULE_STATE",
          COALESCE(sxm."UPDATED_AT", sxm."CREATED_AT") AS "ASSIGNED_AT",
          ROW_NUMBER() OVER (
            PARTITION BY s."STAFF_ID"
            ORDER BY
              (sxm."STATE" = 'A') DESC,
              COALESCE(sxm."UPDATED_AT", sxm."CREATED_AT") DESC NULLS LAST,
              sxm."STAFF_MODULE_ID" DESC
          ) AS rn
        FROM public."STAFF" s
        LEFT JOIN public."STAFF_X_MODULE" sxm
          ON sxm."STAFF_ID" = s."STAFF_ID"
        WHERE s."STATE" = 'A'
      ),
      selected AS (
        SELECT
          CASE
            WHEN assignments."MODULE_STATE" = 'A' THEN assignments."MODULE_ID"
            ELSE NULL
          END AS "MODULE_ID",
          assignments."STAFF_ID"
        FROM assignments
        WHERE assignments.rn = 1
      )
      SELECT
        sel."MODULE_ID" AS "MODULE_ID",
        m."DESCRIPTION" AS "MODULE_NAME",
        COUNT(*)::int AS "STAFF_COUNT"
      FROM selected sel
      LEFT JOIN public."MODULE" m ON m."MODULE_ID" = sel."MODULE_ID"
      ${whereClause}
      GROUP BY sel."MODULE_ID", m."DESCRIPTION"
      ORDER BY "STAFF_COUNT" DESC
    `

    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      MODULE_ID: number | null
      MODULE_NAME: string | null
      STAFF_COUNT: number
    }>(query.query, query.values)

    return rows.map((row) => ({
      moduleId: row.MODULE_ID !== null ? Number(row.MODULE_ID) : null,
      moduleName: this.normalizeModuleName(row.MODULE_NAME),
      staffCount: Number(row.STAFF_COUNT ?? 0),
    }))
  }

  private async getRecentEvaluations(
    filters: DashboardSummaryFilters
  ): Promise<RecentEvaluation[]> {
    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const sql = `
      SELECT
        e."EVALUATION_ID" AS "EVALUATION_ID",
        e."PERIOD" AS "PERIOD",
        e."OVERALL_SCORE" AS "OVERALL_SCORE",
        COALESCE(e."UPDATED_AT", e."CREATED_AT") AS "UPDATED_AT",
        s."NAME" || ' ' || s."LAST_NAME" AS "STAFF_NAME",
        m."DESCRIPTION" AS "MODULE_NAME"
      FROM public."EVALUATION" e
      LEFT JOIN public."STAFF" s ON s."STAFF_ID" = e."STAFF_ID"
      LEFT JOIN public."MODULE" m ON m."MODULE_ID" = e."MODULE_ID"
      ${evaluationWhere.clause}
      ORDER BY COALESCE(e."UPDATED_AT", e."CREATED_AT") DESC
      LIMIT 8
    `

    const query = preparePostgresQuery(sql, evaluationWhere.params)
    const rows = await queryRunner<{
      EVALUATION_ID: number
      PERIOD: number
      OVERALL_SCORE: string | number | null
      UPDATED_AT: Date | null
      STAFF_NAME: string | null
      MODULE_NAME: string | null
    }>(query.query, query.values)

    return rows.map((row) => ({
      evaluationId: Number(row.EVALUATION_ID),
      staffName: this.normalizePersonName(row.STAFF_NAME),
      moduleName: this.normalizeModuleName(row.MODULE_NAME),
      period: Number(row.PERIOD),
      periodLabel: this.formatPeriodLabel(Number(row.PERIOD)),
      overallScore:
        row.OVERALL_SCORE !== null && row.OVERALL_SCORE !== undefined
          ? Number(Number(row.OVERALL_SCORE).toFixed(2))
          : null,
      updatedAt: row.UPDATED_AT ? row.UPDATED_AT.toISOString() : null,
    }))
  }

  private async getFilterOptions(): Promise<DashboardFilterOptions> {
    const modulesSql = `
      SELECT m."MODULE_ID" AS "MODULE_ID", m."DESCRIPTION" AS "DESCRIPTION"
      FROM public."MODULE" m
      WHERE m."STATE" = 'A'
      ORDER BY m."DESCRIPTION"
    `
    const modules = await queryRunner<{
      MODULE_ID: number
      DESCRIPTION: string
    }>(modulesSql)

    const periodsSql = `
      SELECT DISTINCT e."PERIOD" AS "PERIOD"
      FROM public."EVALUATION" e
      WHERE e."STATE" = 'A'
      ORDER BY e."PERIOD" DESC
      LIMIT 24
    `
    const periods = await queryRunner<{ PERIOD: number }>(periodsSql)

    return {
      modules: modules.map((module) => ({
        moduleId: Number(module.MODULE_ID),
        description: module.DESCRIPTION,
      })),
      periods: periods.map((period) => Number(period.PERIOD)),
    }
  }

  private async fetchActivityLog(
    filters: DashboardActivityFilters
  ): Promise<ActivityLogResult> {
    const conditions: string[] = ['1 = 1']
    const params: Record<string, unknown> = {}

    if (filters.action) {
      conditions.push('log."ACTION" = :action')
      params.action = filters.action
    }

    if (filters.model) {
      conditions.push('log."MODEL" ILIKE :model')
      params.model = `%${filters.model}%`
    }

    if (filters.userId) {
      conditions.push('log."USER_ID" = :userId')
      params.userId = filters.userId
    }

    if (filters.dateFrom) {
      conditions.push('log."CREATED_AT" >= :dateFrom')
      params.dateFrom = filters.dateFrom
    }

    if (filters.dateTo) {
      conditions.push('log."CREATED_AT" <= :dateTo')
      params.dateTo = filters.dateTo
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    const countSql = `
      SELECT COUNT(*)::int AS "TOTAL"
      FROM public."ACTIVITY_LOG" log
      ${whereClause}
    `
    const countQuery = preparePostgresQuery(countSql, params)
    const [countRow] = await queryRunner<{ TOTAL: number }>(
      countQuery.query,
      countQuery.values
    )
    const totalRows = Number(countRow?.TOTAL ?? 0)

    const dataSql = `
      SELECT
        log."ID" AS "ID",
        log."ACTION" AS "ACTION",
        log."MODEL" AS "MODEL",
        log."OBJECT_ID" AS "OBJECT_ID",
        log."CHANGES" AS "CHANGES",
        log."CREATED_AT" AS "CREATED_AT",
        log."USER_ID" AS "USER_ID",
        u."USERNAME" AS "USERNAME",
        TRIM(
          COALESCE(s."NAME", '') || ' ' || COALESCE(s."LAST_NAME", '')
        ) AS "STAFF_NAME"
      FROM public."ACTIVITY_LOG" log
      LEFT JOIN public."USERS" u ON u."USER_ID" = log."USER_ID"
      LEFT JOIN public."STAFF" s ON s."STAFF_ID" = u."STAFF_ID"
      ${whereClause}
      ORDER BY log."CREATED_AT" DESC
      LIMIT :limit OFFSET :offset
    `

    const dataParams = {
      ...params,
      limit: filters.limit,
      offset: filters.offset,
    }
    const dataQuery = preparePostgresQuery(dataSql, dataParams)
    const rows = await queryRunner<{
      ID: number
      ACTION: string
      MODEL: string
      OBJECT_ID: unknown
      CHANGES: Record<string, unknown> | null
      CREATED_AT: Date
      USER_ID: number | null
      USERNAME: string | null
      STAFF_NAME: string | null
    }>(dataQuery.query, dataQuery.values)

    const items: ActivityLogEntry[] = rows.map((row) => ({
      id: Number(row.ID),
      action: row.ACTION,
      model: row.MODEL,
      objectId: row.OBJECT_ID,
      changes: row.CHANGES ?? null,
      createdAt: row.CREATED_AT
        ? row.CREATED_AT.toISOString()
        : new Date().toISOString(),
      userId: row.USER_ID !== null ? Number(row.USER_ID) : null,
      username: row.USERNAME ?? null,
      staffName: this.normalizePersonName(row.STAFF_NAME),
    }))

    const page = Math.floor(filters.offset / filters.limit) + 1
    const totalPages = filters.limit ? Math.ceil(totalRows / filters.limit) : 1
    const pagination: Pagination = {
      page,
      size: filters.limit,
      order: 'DESC',
      orderBy: 'CREATED_AT',
    }

    const metadata = getQueryMetadata(
      items.length,
      totalPages || 1,
      pagination,
      totalRows
    )

    return { items, metadata }
  }

  private normalizeModuleName(name?: string | null): string {
    if (!name) {
      return 'Sin modulo'
    }

    return name
  }

  private normalizePersonName(name?: string | null): string | null {
    if (!name) {
      return null
    }

    const trimmed = name.trim()
    return trimmed.length ? trimmed : null
  }

  private formatPeriodLabel(period: number): string {
    const text = String(period)
    if (text.length < 6) {
      return text
    }

    const year = text.slice(0, 4)
    const week = text.slice(4)
    return `${year}-S${week}`
  }
}
