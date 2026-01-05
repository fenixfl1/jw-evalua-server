import { BaseService, CatchServiceError } from './base.service'
import { ApiResponse, Metadata, Pagination } from '@src/types/api.types'
import { preparePostgresQuery } from '@src/api/middlewares/prepare-postgres-query'
import { getQueryMetadata, queryRunner } from '@src/helpers/query-utils'
import { GoalTaskSession } from '@src/entity/GoalTaskSession'
import { In, Repository } from 'typeorm'
import { Staff } from '@src/entity/Staff'
import { Module } from '@src/entity/Module'

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
  targetTime: number
  actualTime: number
  timeEfficiency: number | null
  timeVariance: number
  goalsAssigned: number
  goalsCompleted: number
  completionRate: number | null
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

interface ModuleTopPerformer {
  moduleId: number | null
  moduleName: string
  staffId: number | null
  staffName: string | null
  averageScore: number | null
  evaluationsCompleted: number
  lastEvaluationAt: string | null
  rank: number
}

interface GoalProductivityDetail {
  goalModuleId: number | null
  goalId: number | null
  moduleId: number | null
  moduleName: string
  period: number | null
  targetValue: number
  targetTime: number
  actualValue: number
  actualTime: number
}

interface GoalProductivityModuleAccumulator {
  moduleId: number | null
  moduleName: string
  targetValue: number
  actualValue: number
  targetTime: number
  actualTime: number
  goalsAssigned: number
  goalsCompleted: number
  completedTargetTime: number
  completedActualTime: number
  completedCount: number
  completedOnTime: number
  completedLate: number
  inProgress: number
  pending: number
}

interface GoalProductivityModule {
  moduleId: number | null
  moduleName: string
  totalGoals: number
  completedGoals: number
  completionRate: number | null
  goalsOnTime: number
  goalsLate: number
  goalsInProgress: number
  goalsPending: number
  timeEfficiency: number | null
  averageTargetTime: number | null
  averageActualTime: number | null
  averageTimeVariance: number | null
}

interface GoalProductivityTrendPoint {
  period: number | null
  periodLabel: string
  totalGoals: number
  completedGoals: number
  completionRate: number | null
  targetValue: number
  actualValue: number
  targetTime: number
  actualTime: number
  averageTargetTime: number | null
  averageActualTime: number | null
}

interface GoalProductivityTotals {
  totalGoals: number
  completedGoals: number
  completionRate: number | null
  averageTargetTime: number | null
  averageActualTime: number | null
  averageTimeVariance: number | null
  totalTargetValue: number
  totalActualValue: number
  totalTargetTime: number
  totalActualTime: number
}

interface GoalTimeInsights {
  completedOnTime: number
  completedLate: number
  completedAhead: number
  inProgress: number
  notStarted: number
  averageTimeVariance: number | null
  averageTargetTime: number | null
  averageActualTime: number | null
}

interface WorkedHoursModule {
  moduleId: number | null
  moduleName: string
  secondsWorked: number
  hoursWorked: number
  activeSessions: number
  staffCount: number
}

interface WorkedHoursStaff {
  staffId: number
  staffName: string
  moduleId: number | null
  moduleName: string
  secondsWorked: number
  hoursWorked: number
  activeSessions: number
}

interface EmployeeProductivityEntry {
  staffId: number | null
  staffName: string
  modules: string[]
  assignedGoals: number
  completedGoals: number
  completionRate: number | null
  completedOnTime: number
  completedLate: number
  inProgressGoals: number
  pendingGoals: number
  totalTargetTime: number
  totalActualTime: number
  averageTargetTime: number | null
  averageActualTime: number | null
  averageTimeVariance: number | null
  efficiency: number | null
}

interface GoalProductivityMetrics {
  totals: GoalProductivityTotals
  byModule: GoalProductivityModule[]
  byPeriod: GoalProductivityTrendPoint[]
  timeInsights: GoalTimeInsights
  employees: EmployeeProductivityEntry[]
}

interface GoalComplianceSummary {
  items: ModuleGoalCompliance[]
  averageCompliance: number | null
  activeGoals: number
  productivity: GoalProductivityMetrics
}

interface DashboardDailySummary {
  date: string
  targetValue: number
  actualValue: number
  completionRate: number | null
  targetTime: number | null
  actualTime: number | null
  timeVariance: number | null
  activeGoals: number
  completedGoals: number
  evaluationsCompleted: number
  activityCount: number
}

interface DashboardSummary {
  kpis: DashboardKpis
  evaluationsTrend: EvaluationTrendPoint[]
  evaluationsByModule: ModuleEvaluationSummary[]
  goalComplianceByModule: ModuleGoalCompliance[]
  staffDistribution: StaffDistributionEntry[]
  recentEvaluations: RecentEvaluation[]
  filters: DashboardFilterOptions
  goalProductivity: GoalProductivityMetrics
  moduleTopPerformers: ModuleTopPerformer[]
  dailySummary: DashboardDailySummary
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
  private goalTaskSessionRepository = this.dataSource.getRepository(GoalTaskSession)
  private moduleRepository = this.dataSource.getRepository(Module)

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
      moduleTopPerformers,
      dailySummary,
    ] = await Promise.all([
      this.getKpis(normalizedFilters),
      this.getEvaluationTrend(normalizedFilters),
      this.getEvaluationsByModule(normalizedFilters),
      this.getGoalComplianceSummary(normalizedFilters),
      this.getStaffDistribution(normalizedFilters),
      this.getRecentEvaluations(normalizedFilters),
      this.getFilterOptions(),
      this.getModuleTopPerformers(normalizedFilters),
      this.getDailySummary(normalizedFilters),
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
      goalProductivity: goalSummary.productivity,
      moduleTopPerformers,
      dailySummary,
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

  @CatchServiceError()
  async getWorkedHoursByModule(
    period?: number
  ): Promise<ApiResponse<WorkedHoursModule[]>> {
    const sessions = await this.loadSessions({ period })
    const moduleProgressHours = await this.getModuleProgressHours({ period })
    const staffManualSeconds = await this.getStaffManualSeconds({ period })

    const moduleMap = new Map<
      number | null,
      { seconds: number; activeSessions: number; staff: Set<number> }
    >()

    sessions.forEach(({ session, seconds }) => {
      const moduleId = session.MODULE_ID ?? session.GOAL_MODULE_ID ?? null
      const existing =
        moduleMap.get(moduleId) ??
        (() => {
          const entry = { seconds: 0, activeSessions: 0, staff: new Set<number>() }
          moduleMap.set(moduleId, entry)
          return entry
        })()

      existing.seconds += seconds
      if (session.IS_ACTIVE) existing.activeSessions += 1
      if (session.STAFF_ID) existing.staff.add(session.STAFF_ID)
    })

    moduleProgressHours.forEach((hours, moduleId) => {
      if (!hours) return
      const existing =
        moduleMap.get(moduleId) ??
        (() => {
          const entry = {
            seconds: 0,
            activeSessions: 0,
            staff: new Set<number>(),
          }
          moduleMap.set(moduleId, entry)
          return entry
        })()
      existing.seconds += hours * 3600
    })

    staffManualSeconds.forEach((info, staffId) => {
      if (info.moduleId === undefined) return
      const existing =
        moduleMap.get(info.moduleId) ??
        (() => {
          const entry = {
            seconds: 0,
            activeSessions: 0,
            staff: new Set<number>(),
          }
          moduleMap.set(info.moduleId, entry)
          return entry
        })()
      existing.seconds += info.seconds
      existing.staff.add(staffId)
    })

    const moduleIds = Array.from(moduleMap.keys()).filter(
      (id): id is number => id !== null && Number.isInteger(id)
    )
    const modules = moduleIds.length
      ? await this.moduleRepository.find({
          where: { MODULE_ID: In(moduleIds) as never },
        })
      : []
    const moduleNameMap = new Map<number, string>(
      modules.map((m) => [m.MODULE_ID, m.DESCRIPTION])
    )

    const result: WorkedHoursModule[] = Array.from(moduleMap.entries()).map(
      ([moduleId, info]) => {
        const hoursWorked = Number((info.seconds / 3600).toFixed(2))

        return {
          moduleId,
          moduleName:
            moduleId !== null && moduleNameMap.get(moduleId)
              ? moduleNameMap.get(moduleId)!
              : 'Sin módulo',
          secondsWorked: Number(info.seconds.toFixed(2)),
          hoursWorked,
          activeSessions: info.activeSessions,
          staffCount: info.staff.size,
        }
      }
    )

    const sorted = result.sort((a, b) => b.hoursWorked - a.hoursWorked)
    return this.success({ data: sorted })
  }

  @CatchServiceError()
  async getWorkedHoursByStaff(
    period?: number,
    moduleId?: number
  ): Promise<ApiResponse<WorkedHoursStaff[]>> {
    const sessions = await this.loadSessions({ period, moduleId })
    const staffManualSeconds = await this.getStaffManualSeconds({
      period,
      moduleId,
    })

    const staffMap = new Map<
      number,
      { seconds: number; activeSessions: number; moduleId: number | null }
    >()

    sessions.forEach(({ session, seconds }) => {
      if (!session.STAFF_ID) return
      const existing =
        staffMap.get(session.STAFF_ID) ??
        (() => {
          const entry = {
            seconds: 0,
            activeSessions: 0,
            moduleId: session.MODULE_ID ?? session.GOAL_MODULE_ID ?? null,
          }
          staffMap.set(session.STAFF_ID, entry)
          return entry
        })()

      existing.seconds += seconds
      if (session.IS_ACTIVE) existing.activeSessions += 1
      if (session.MODULE_ID && !existing.moduleId) {
        existing.moduleId = session.MODULE_ID
      }
    })

    staffManualSeconds.forEach((info, staffId) => {
      const existing =
        staffMap.get(staffId) ??
        (() => {
          const entry = {
            seconds: 0,
            activeSessions: 0,
            moduleId: info.moduleId ?? null,
          }
          staffMap.set(staffId, entry)
          return entry
        })()
      existing.seconds += info.seconds
      if (!existing.moduleId && info.moduleId !== undefined) {
        existing.moduleId = info.moduleId
      }
    })

    if (!staffMap.size) {
      return this.success({ data: [] })
    }

    const staffIds = Array.from(staffMap.keys())
    const staffRecords = staffIds.length
      ? await this.staffRepository.find({
          where: { STAFF_ID: In(staffIds) as never },
        })
      : []

    const moduleIds = Array.from(
      new Set(
        Array.from(staffMap.values())
          .map((v) => v.moduleId)
          .filter(Boolean)
      )
    ) as number[]
    const modules = moduleIds.length
      ? await this.moduleRepository.find({
          where: { MODULE_ID: In(moduleIds) as never },
        })
      : []
    const moduleNameMap = new Map<number, string>(
      modules.map((m) => [m.MODULE_ID, m.DESCRIPTION])
    )

    const result: WorkedHoursStaff[] = staffIds.map((id) => {
      const stats = staffMap.get(id)!
      const staff = staffRecords.find((s) => s.STAFF_ID === id)
      const hoursWorked = Number((stats.seconds / 3600).toFixed(2))
      const moduleName =
        stats.moduleId && moduleNameMap.get(stats.moduleId)
          ? moduleNameMap.get(stats.moduleId)!
          : 'Sin módulo'

      return {
        staffId: id,
        staffName: staff
          ? `${staff.NAME} ${staff.LAST_NAME}`
          : `Operario ${id}`,
        moduleId: stats.moduleId,
        moduleName,
        secondsWorked: Number(stats.seconds.toFixed(2)),
        hoursWorked,
        activeSessions: stats.activeSessions,
      }
    })

    const sorted = result.sort((a, b) => b.hoursWorked - a.hoursWorked)
    return this.success({ data: sorted })
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
    const conditions: string[] = [`gp."STATE" = 'A'`]
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

  private async getGoalProductivityDetails(
    filters: DashboardSummaryFilters
  ): Promise<GoalProductivityDetail[]> {
    const assignmentWhere = this.buildGoalAssignmentWhere(filters)
    const progressWhere = this.buildGoalProgressWhere(filters)

    const params: Record<string, unknown> = {
      ...assignmentWhere.params,
      ...progressWhere.params,
    }

    const sql = `
      WITH ASSIGNED AS (
        SELECT
          gm."GOAL_MODULE_ID",
          gm."GOAL_ID",
          gm."MODULE_ID",
          gm."PERIOD",
          SUM(COALESCE(gm."TARGET_VALUE", 0)) AS "TARGET_VALUE",
          SUM(COALESCE(gdt."TARGET_TIME", 0)) AS "TARGET_TIME"
        FROM public."GOAL_X_MODULE" gm
        INNER JOIN public."GOAL" g ON g."GOAL_ID" = gm."GOAL_ID"
        LEFT JOIN public."GOAL_DAILY_TARGET" gdt
          ON gdt."GOAL_MODULE_ID" = gm."GOAL_MODULE_ID"
         AND gdt."STATE" = 'A'
        ${assignmentWhere.clause}
        GROUP BY gm."GOAL_MODULE_ID", gm."GOAL_ID", gm."MODULE_ID", gm."PERIOD"
      ),
      PROGRESS AS (
        SELECT
          gp."GOAL_MODULE_ID",
          gp."GOAL_ID",
          gp."MODULE_ID",
          gp."PERIOD",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'module'
              THEN COALESCE(gp."ACTUAL_VALUE", 0)
              ELSE 0
            END
          ) AS "MODULE_VALUE",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'module'
              THEN COALESCE(gp."ACTUAL_TIME", 0)
              ELSE 0
            END
          ) AS "MODULE_TIME",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'individual'
              THEN COALESCE(gp."ACTUAL_VALUE", 0)
              ELSE 0
            END
          ) AS "INDIVIDUAL_VALUE",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'individual'
              THEN COALESCE(gp."ACTUAL_TIME", 0)
              ELSE 0
            END
          ) AS "INDIVIDUAL_TIME"
        FROM public."GOAL_PROGRESS" gp
        ${progressWhere.clause}
        GROUP BY gp."GOAL_MODULE_ID", gp."GOAL_ID", gp."MODULE_ID", gp."PERIOD"
      )
      SELECT
        COALESCE(a."GOAL_MODULE_ID", p."GOAL_MODULE_ID") AS "GOAL_MODULE_ID",
        COALESCE(a."GOAL_ID", p."GOAL_ID") AS "GOAL_ID",
        COALESCE(a."MODULE_ID", p."MODULE_ID") AS "MODULE_ID",
        m."DESCRIPTION" AS "MODULE_NAME",
        COALESCE(a."PERIOD", p."PERIOD") AS "PERIOD",
        COALESCE(a."TARGET_VALUE", 0) AS "TARGET_VALUE",
        COALESCE(a."TARGET_TIME", 0) AS "TARGET_TIME",
        COALESCE(
          NULLIF(p."MODULE_VALUE", 0),
          p."INDIVIDUAL_VALUE",
          0
        ) AS "ACTUAL_VALUE",
        COALESCE(
          NULLIF(p."MODULE_TIME", 0),
          p."INDIVIDUAL_TIME",
          0
        ) AS "ACTUAL_TIME"
      FROM ASSIGNED a
      FULL OUTER JOIN PROGRESS p
        ON p."GOAL_MODULE_ID" = a."GOAL_MODULE_ID"
       AND p."PERIOD" IS NOT DISTINCT FROM a."PERIOD"
      LEFT JOIN public."MODULE" m
        ON m."MODULE_ID" = COALESCE(a."MODULE_ID", p."MODULE_ID")
    `

    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      GOAL_MODULE_ID: number | null
      GOAL_ID: number | null
      MODULE_ID: number | null
      MODULE_NAME: string | null
      PERIOD: number | null
      TARGET_VALUE: string | number | null
      TARGET_TIME: string | number | null
      ACTUAL_VALUE: string | number | null
      ACTUAL_TIME: string | number | null
    }>(query.query, query.values)

    const sessionHours = await this.getSessionHoursByGoal(filters)
    const supervisorHours = await this.getSupervisorHoursByGoal(filters)

    return rows.map((row) => {
      const goalModuleId =
        row.GOAL_MODULE_ID !== null ? Number(row.GOAL_MODULE_ID) : null
      const period = row.PERIOD !== null ? Number(row.PERIOD) : null
      const key = this.buildGoalModuleKey(goalModuleId, period)
      const additionalTime =
        (goalModuleId !== null ? sessionHours.get(key) ?? 0 : 0) +
        (goalModuleId !== null ? supervisorHours.get(key) ?? 0 : 0)

      return {
        goalModuleId,
        goalId: row.GOAL_ID !== null ? Number(row.GOAL_ID) : null,
        moduleId: row.MODULE_ID !== null ? Number(row.MODULE_ID) : null,
        moduleName: this.normalizeModuleName(row.MODULE_NAME),
        period,
        targetValue: Number(row.TARGET_VALUE ?? 0),
        targetTime: Number(row.TARGET_TIME ?? 0),
        actualValue: Number(row.ACTUAL_VALUE ?? 0),
        actualTime: Number(row.ACTUAL_TIME ?? 0) + additionalTime,
      }
    })
  }

  private async getGoalComplianceSummary(
    filters: DashboardSummaryFilters
  ): Promise<GoalComplianceSummary> {
    const details = await this.getGoalProductivityDetails(filters)
    const moduleAccumulators = new Map<
      number | null,
      GoalProductivityModuleAccumulator
    >()

    details.forEach((detail) => {
      const key = detail.moduleId ?? null
      let accumulator = moduleAccumulators.get(key)

      if (!accumulator) {
        accumulator = {
          moduleId: detail.moduleId ?? null,
          moduleName: detail.moduleName,
          targetValue: 0,
          actualValue: 0,
          targetTime: 0,
          actualTime: 0,
          goalsAssigned: 0,
          goalsCompleted: 0,
          completedTargetTime: 0,
          completedActualTime: 0,
          completedCount: 0,
          completedOnTime: 0,
          completedLate: 0,
          inProgress: 0,
          pending: 0,
        }
        moduleAccumulators.set(key, accumulator)
      }

      accumulator.targetValue += detail.targetValue
      accumulator.actualValue += detail.actualValue
      accumulator.targetTime += detail.targetTime
      accumulator.actualTime += detail.actualTime

      if (detail.targetValue > 0) {
        accumulator.goalsAssigned += 1
        if (detail.actualValue >= detail.targetValue) {
          accumulator.goalsCompleted += 1
          accumulator.completedTargetTime += detail.targetTime
          accumulator.completedActualTime += detail.actualTime
          accumulator.completedCount += 1
          const isLate =
            detail.targetTime > 0 && detail.actualTime > detail.targetTime
          if (isLate) {
            accumulator.completedLate += 1
          } else {
            accumulator.completedOnTime += 1
          }
        } else if (detail.actualValue > 0) {
          accumulator.inProgress += 1
        } else {
          accumulator.pending += 1
        }
      }
    })

    const items = Array.from(moduleAccumulators.values()).map((entry) => {
      const compliance =
        entry.targetValue > 0
          ? this.roundNumber((entry.actualValue / entry.targetValue) * 100)
          : null

      const timeEfficiency =
        entry.targetTime > 0
          ? this.roundNumber((entry.actualTime / entry.targetTime) * 100)
          : null

      const timeVariance = this.roundNumber(
        entry.actualTime - entry.targetTime
      )

      return {
        moduleId: entry.moduleId,
        moduleName: entry.moduleName,
        targetValue: entry.targetValue,
        actualValue: entry.actualValue,
        compliance,
        targetTime: this.roundNumber(entry.targetTime),
        actualTime: this.roundNumber(entry.actualTime),
        timeEfficiency,
        timeVariance,
        goalsAssigned: entry.goalsAssigned,
        goalsCompleted: entry.goalsCompleted,
        completionRate: this.calculateCompletionRate(
          entry.goalsCompleted,
          entry.goalsAssigned
        ),
      }
    })

    const averageCompliance = this.calculateAverageCompliance(items)
    const activeGoals = await this.getActiveGoalCount(filters)
    const productivity = this.calculateGoalProductivityMetrics(
      details,
      moduleAccumulators
    )
    const employeeProductivity = await this.getEmployeeProductivitySummary(
      filters,
      details
    )
    productivity.employees = employeeProductivity

    return {
      items,
      averageCompliance,
      activeGoals,
      productivity,
    }
  }

  private calculateGoalProductivityMetrics(
    details: GoalProductivityDetail[],
    moduleAccumulators: Map<number | null, GoalProductivityModuleAccumulator>
  ): GoalProductivityMetrics {
    const assignedDetails = details.filter(
      (detail) => detail.targetValue > 0
    )
    const completedDetails = assignedDetails.filter(
      (detail) => detail.actualValue >= detail.targetValue
    )

    let completedOnTimeCount = 0
    let completedLateCount = 0
    let completedAheadCount = 0
    let inProgressCount = 0
    let notStartedCount = 0

    let completedTargetTimeSum = 0
    let completedActualTimeSum = 0
    let completedVarianceSum = 0

    assignedDetails.forEach((detail) => {
      const isCompleted = detail.actualValue >= detail.targetValue
      const hasProgress = detail.actualValue > 0

      if (isCompleted) {
        const isLate =
          detail.targetTime > 0 && detail.actualTime > detail.targetTime
        if (isLate) {
          completedLateCount += 1
        } else {
          completedOnTimeCount += 1
          if (detail.targetTime > 0 && detail.actualTime < detail.targetTime) {
            completedAheadCount += 1
          }
        }

        completedTargetTimeSum += detail.targetTime
        completedActualTimeSum += detail.actualTime
        completedVarianceSum += detail.actualTime - detail.targetTime
      } else if (hasProgress) {
        inProgressCount += 1
      } else {
        notStartedCount += 1
      }
    })

    const totalGoals = assignedDetails.length
    const completedGoals = completedDetails.length

    const totalTargetValue = details.reduce(
      (acc, detail) => acc + detail.targetValue,
      0
    )
    const totalActualValue = details.reduce(
      (acc, detail) => acc + detail.actualValue,
      0
    )
    const totalTargetTime = details.reduce(
      (acc, detail) => acc + detail.targetTime,
      0
    )
    const totalActualTime = details.reduce(
      (acc, detail) => acc + detail.actualTime,
      0
    )

    const averageTargetTime =
      completedGoals > 0
        ? this.roundNumber(completedTargetTimeSum / completedGoals)
        : totalGoals > 0
        ? this.roundNumber(totalTargetTime / totalGoals)
        : null
    const averageActualTime =
      completedGoals > 0
        ? this.roundNumber(completedActualTimeSum / completedGoals)
        : totalGoals > 0
        ? this.roundNumber(totalActualTime / totalGoals)
        : null
    const averageTimeVariance =
      completedGoals > 0
        ? this.roundNumber(completedVarianceSum / completedGoals)
        : null

    const byModule = Array.from(moduleAccumulators.values())
      .map((entry) => {
        const averageTarget =
          entry.completedCount > 0
            ? this.roundNumber(
                entry.completedTargetTime / entry.completedCount
              )
            : null
        const averageActual =
          entry.completedCount > 0
            ? this.roundNumber(
                entry.completedActualTime / entry.completedCount
              )
            : null
        const averageVariance =
          entry.completedCount > 0
            ? this.roundNumber(
                (entry.completedActualTime - entry.completedTargetTime) /
                  entry.completedCount
              )
            : null

        const timeEfficiency =
          entry.targetTime > 0
            ? this.roundNumber((entry.actualTime / entry.targetTime) * 100)
            : null

        return {
          moduleId: entry.moduleId,
          moduleName: entry.moduleName,
          totalGoals: entry.goalsAssigned,
          completedGoals: entry.goalsCompleted,
          completionRate: this.calculateCompletionRate(
            entry.goalsCompleted,
            entry.goalsAssigned
          ),
          goalsOnTime: entry.completedOnTime,
          goalsLate: entry.completedLate,
          goalsInProgress: entry.inProgress,
          goalsPending: entry.pending,
          timeEfficiency,
          averageTargetTime: averageTarget,
          averageActualTime: averageActual,
          averageTimeVariance: averageVariance,
        }
      })
      .sort((a, b) => {
        const rateA = a.completionRate ?? -Infinity
        const rateB = b.completionRate ?? -Infinity
        if (rateA === rateB) {
          return b.completedGoals - a.completedGoals
        }
        return rateB - rateA
      })

    const periodAccumulators = new Map<
      string,
      {
        period: number | null
        periodLabel: string
        totalGoals: number
        completedGoals: number
        targetValue: number
        actualValue: number
        targetTime: number
        actualTime: number
        completedTargetTime: number
        completedActualTime: number
        completedCount: number
      }
    >()

    details.forEach((detail) => {
      const periodKey = detail.period !== null ? String(detail.period) : 'null'
      let entry = periodAccumulators.get(periodKey)

      if (!entry) {
        entry = {
          period: detail.period !== null ? Number(detail.period) : null,
          periodLabel:
            detail.period !== null
              ? this.formatPeriodLabel(detail.period)
              : 'Sin periodo',
          totalGoals: 0,
          completedGoals: 0,
          targetValue: 0,
          actualValue: 0,
          targetTime: 0,
          actualTime: 0,
          completedTargetTime: 0,
          completedActualTime: 0,
          completedCount: 0,
        }
        periodAccumulators.set(periodKey, entry)
      }

      entry.targetValue += detail.targetValue
      entry.actualValue += detail.actualValue
      entry.targetTime += detail.targetTime
      entry.actualTime += detail.actualTime

      if (detail.targetValue > 0) {
        entry.totalGoals += 1
        if (detail.actualValue >= detail.targetValue) {
          entry.completedGoals += 1
          entry.completedTargetTime += detail.targetTime
          entry.completedActualTime += detail.actualTime
          entry.completedCount += 1
        }
      }
    })

    const byPeriod = Array.from(periodAccumulators.values())
      .map((entry) => {
        const averageTarget =
          entry.completedCount > 0
            ? this.roundNumber(
                entry.completedTargetTime / entry.completedCount
              )
            : null
        const averageActual =
          entry.completedCount > 0
            ? this.roundNumber(
                entry.completedActualTime / entry.completedCount
              )
            : null
        const complianceRate =
          entry.targetValue > 0
            ? this.roundNumber(
                Math.min((entry.actualValue / entry.targetValue) * 100, 150)
              )
            : null

        return {
          period: entry.period,
          periodLabel: entry.periodLabel,
          totalGoals: entry.totalGoals,
          completedGoals: entry.completedGoals,
          completionRate: complianceRate,
          targetValue: entry.targetValue,
          actualValue: entry.actualValue,
          targetTime: this.roundNumber(entry.targetTime),
          actualTime: this.roundNumber(entry.actualTime),
          averageTargetTime: averageTarget,
          averageActualTime: averageActual,
        }
      })
      .sort((a, b) => {
        if (a.period === null && b.period === null) {
          return 0
        }
        if (a.period === null) {
          return 1
        }
        if (b.period === null) {
          return -1
        }
        return a.period - b.period
      })

    const timeInsights: GoalTimeInsights = {
      completedOnTime: completedOnTimeCount,
      completedLate: completedLateCount,
      completedAhead: completedAheadCount,
      inProgress: inProgressCount,
      notStarted: notStartedCount,
      averageTimeVariance,
      averageTargetTime,
      averageActualTime,
    }

    return {
      totals: {
        totalGoals,
        completedGoals,
        completionRate: this.calculateCompletionRate(
          completedGoals,
          totalGoals
        ),
        averageTargetTime,
        averageActualTime,
        averageTimeVariance,
        totalTargetValue,
        totalActualValue,
        totalTargetTime: this.roundNumber(totalTargetTime),
        totalActualTime: this.roundNumber(totalActualTime),
      },
      byModule,
      byPeriod,
      timeInsights,
      employees: [],
    }
  }

  private buildGoalModuleKey(
    goalModuleId: number | null,
    period: number | null
  ): string {
    const moduleKey = goalModuleId !== null ? String(goalModuleId) : 'null'
    const periodKey = period !== null ? String(period) : 'null'
    return `${moduleKey}-${periodKey}`
  }

  private async getSessionHoursByGoal(
    filters: DashboardSummaryFilters
  ): Promise<Map<string, number>> {
    const conditions: string[] = [`sess."STATE" = 'A'`, `sess."GOAL_MODULE_ID" IS NOT NULL`]
    const params: Record<string, unknown> = {}

    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      conditions.push('sess."MODULE_ID" = :sessionModuleId')
      params.sessionModuleId = filters.moduleId
    }

    if (filters.periodStart !== undefined && filters.periodStart !== null) {
      conditions.push('sess."PERIOD" >= :sessionPeriodStart')
      params.sessionPeriodStart = filters.periodStart
    }

    if (filters.periodEnd !== undefined && filters.periodEnd !== null) {
      conditions.push('sess."PERIOD" <= :sessionPeriodEnd')
      params.sessionPeriodEnd = filters.periodEnd
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const sql = `
      SELECT
        sess."GOAL_MODULE_ID",
        sess."PERIOD",
        SUM(
          COALESCE(sess."ACCUMULATED_SECONDS", 0)
          +
          CASE
            WHEN sess."IS_ACTIVE" = TRUE THEN GREATEST(
              EXTRACT(
                EPOCH FROM (
                  CURRENT_TIMESTAMP
                  - COALESCE(sess."LAST_RESUMED_AT", sess."STARTED_AT")
                )
              ),
              0
            )
            ELSE 0
          END
        ) AS "SECONDS"
      FROM public."GOAL_TASK_SESSION" sess
      ${whereClause}
      GROUP BY sess."GOAL_MODULE_ID", sess."PERIOD"
    `
    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      GOAL_MODULE_ID: number | null
      PERIOD: number | null
      SECONDS: string | number | null
    }>(query.query, query.values)

    const map = new Map<string, number>()
    rows.forEach((row) => {
      const key = this.buildGoalModuleKey(
        row.GOAL_MODULE_ID !== null ? Number(row.GOAL_MODULE_ID) : null,
        row.PERIOD !== null ? Number(row.PERIOD) : null
      )
      const hours = Number(row.SECONDS ?? 0) / 3600
      map.set(key, hours)
    })
    return map
  }

  private async getSupervisorHoursByGoal(
    filters: DashboardSummaryFilters
  ): Promise<Map<string, number>> {
    const conditions: string[] = [
      `gtc."STATE" = 'A'`,
      `gtc."GOAL_MODULE_ID" IS NOT NULL`,
      `gtc."METADATA" IS NOT NULL`,
      `gtc."METADATA" ? 'timeMinutes'`,
    ]
    const params: Record<string, unknown> = {}

    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      conditions.push('gtc."MODULE_ID" = :supervisorModuleId')
      params.supervisorModuleId = filters.moduleId
    }

    if (filters.periodStart !== undefined && filters.periodStart !== null) {
      conditions.push('gtc."PERIOD" >= :supervisorPeriodStart')
      params.supervisorPeriodStart = filters.periodStart
    }

    if (filters.periodEnd !== undefined && filters.periodEnd !== null) {
      conditions.push('gtc."PERIOD" <= :supervisorPeriodEnd')
      params.supervisorPeriodEnd = filters.periodEnd
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const sql = `
      SELECT
        gtc."GOAL_MODULE_ID",
        gtc."PERIOD",
        SUM(
          CASE
            WHEN (gtc."METADATA"->>'timeMinutes') ~ '^[-+]?[0-9]+(\\.[0-9]+)?$'
            THEN (gtc."METADATA"->>'timeMinutes')::numeric
            ELSE 0
          END
        ) AS "MINUTES"
      FROM public."GOAL_TASK_COMPLETION" gtc
      ${whereClause}
      GROUP BY gtc."GOAL_MODULE_ID", gtc."PERIOD"
    `
    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      GOAL_MODULE_ID: number | null
      PERIOD: number | null
      MINUTES: string | number | null
    }>(query.query, query.values)

    const map = new Map<string, number>()
    rows.forEach((row) => {
      const key = this.buildGoalModuleKey(
        row.GOAL_MODULE_ID !== null ? Number(row.GOAL_MODULE_ID) : null,
        row.PERIOD !== null ? Number(row.PERIOD) : null
      )
      const hours = Number(row.MINUTES ?? 0) / 60
      map.set(key, hours)
    })
    return map
  }

  private async getSessionSecondsByStaff(
    filters: DashboardSummaryFilters
  ): Promise<Map<number, number>> {
    const sessionFilters: {
      period?: number
      periodStart?: number
      periodEnd?: number
      moduleId?: number
    } = {}

    if (
      filters.periodStart !== undefined &&
      filters.periodEnd !== undefined &&
      filters.periodStart === filters.periodEnd
    ) {
      sessionFilters.period = filters.periodStart
    } else {
      if (filters.periodStart !== undefined) {
        sessionFilters.periodStart = filters.periodStart
      }
      if (filters.periodEnd !== undefined) {
        sessionFilters.periodEnd = filters.periodEnd
      }
    }
    if (filters.moduleId !== undefined) {
      sessionFilters.moduleId = filters.moduleId
    }

    const sessions = await this.loadSessions(sessionFilters)
    const map = new Map<number, number>()

    sessions.forEach(({ session, seconds }) => {
      if (!session.STAFF_ID) return
      const current = map.get(session.STAFF_ID) ?? 0
      map.set(session.STAFF_ID, current + seconds)
    })

    return map
  }

  private async getEmployeeProductivitySummary(
    filters: DashboardSummaryFilters,
    details: GoalProductivityDetail[]
  ): Promise<EmployeeProductivityEntry[]> {
    if (!details.length) {
      return []
    }

    const moduleDetailMap = new Map<
      string,
      { targetTime: number; targetValue: number }
    >()

    details.forEach((detail) => {
      const key = this.buildGoalModuleKey(detail.goalModuleId, detail.period)
      moduleDetailMap.set(key, {
        targetTime: detail.targetTime,
        targetValue: detail.targetValue,
      })
    })

    const sessionSecondsByStaff = await this.getSessionSecondsByStaff(filters)
    const manualSecondsByStaff = await this.getStaffManualSeconds({
      moduleId: filters.moduleId,
      period:
        filters.periodStart !== undefined &&
        filters.periodEnd !== undefined &&
        filters.periodStart === filters.periodEnd
          ? filters.periodStart
          : undefined,
      periodStart:
        filters.periodStart !== undefined &&
        filters.periodEnd !== undefined &&
        filters.periodStart === filters.periodEnd
          ? undefined
          : filters.periodStart,
      periodEnd:
        filters.periodStart !== undefined &&
        filters.periodEnd !== undefined &&
        filters.periodStart === filters.periodEnd
          ? undefined
          : filters.periodEnd,
    })

    const conditions: string[] = [
      `gs."STATE" = 'A'`,
      `g."STATE" = 'A'`,
      `gm."STATE" = 'A'`,
    ]
    const params: Record<string, unknown> = {}

    if (filters.moduleId !== undefined) {
      conditions.push('st."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    if (filters.periodStart !== undefined) {
      conditions.push('gs."PERIOD" >= :periodStart')
      params.periodStart = filters.periodStart
    }

    if (filters.periodEnd !== undefined) {
      conditions.push('gs."PERIOD" <= :periodEnd')
      params.periodEnd = filters.periodEnd
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join('\n        AND ')}`
      : ''

    const sql = `
      WITH staff_contrib AS (
        SELECT
          gp."GOAL_ID",
          gp."STAFF_ID",
          gp."PERIOD",
          SUM(COALESCE(gp."ACTUAL_VALUE", 0)) AS "ACTUAL_VALUE",
          SUM(COALESCE(gp."ACTUAL_TIME", 0)) AS "ACTUAL_TIME"
        FROM public."GOAL_PROGRESS" gp
        WHERE gp."STATE" = 'A'
          AND gp."SCOPE" = 'individual'
          AND gp."STAFF_ID" IS NOT NULL
        GROUP BY gp."GOAL_ID", gp."STAFF_ID", gp."PERIOD"
      )
      SELECT
        gs."STAFF_ID" AS "STAFF_ID",
        TRIM(
          COALESCE(st."NAME", '') || ' ' || COALESCE(st."LAST_NAME", '')
        ) AS "STAFF_NAME",
        gs."GOAL_ID" AS "GOAL_ID",
        gs."PERIOD" AS "PERIOD",
        gs."TARGET_VALUE" AS "STAFF_TARGET_VALUE",
        gm."TARGET_VALUE" AS "MODULE_TARGET_VALUE",
        gm."GOAL_MODULE_ID" AS "GOAL_MODULE_ID",
        COALESCE(sc."ACTUAL_VALUE", 0) AS "STAFF_ACTUAL_VALUE",
        COALESCE(sc."ACTUAL_TIME", 0) AS "STAFF_ACTUAL_TIME",
        st."MODULE_ID" AS "STAFF_MODULE_ID",
        sm."DESCRIPTION" AS "STAFF_MODULE_NAME"
      FROM public."GOAL_X_STAFF" gs
      INNER JOIN public."GOAL" g ON g."GOAL_ID" = gs."GOAL_ID"
      INNER JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_ID" = gs."GOAL_ID"
       AND gm."PERIOD" IS NOT DISTINCT FROM gs."PERIOD"
      LEFT JOIN staff_contrib sc
        ON sc."GOAL_ID" = gs."GOAL_ID"
       AND sc."STAFF_ID" = gs."STAFF_ID"
       AND sc."PERIOD" IS NOT DISTINCT FROM gs."PERIOD"
      LEFT JOIN public."STAFF" st ON st."STAFF_ID" = gs."STAFF_ID"
      LEFT JOIN public."MODULE" sm ON sm."MODULE_ID" = st."MODULE_ID"
      ${whereClause}
    `

    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      STAFF_ID: number | null
      STAFF_NAME: string | null
      GOAL_ID: number
      PERIOD: number | null
      STAFF_TARGET_VALUE: string | number | null
      MODULE_TARGET_VALUE: string | number | null
      GOAL_MODULE_ID: number | null
      STAFF_ACTUAL_VALUE: string | number | null
      STAFF_ACTUAL_TIME: string | number | null
      STAFF_MODULE_ID: number | null
      STAFF_MODULE_NAME: string | null
    }>(query.query, query.values)

    if (!rows.length) {
      return []
    }

    type StaffAccumulator = {
      staffId: number
      staffName: string
      modules: Set<string>
      assignedGoals: number
      completedGoals: number
      completedOnTime: number
      completedLate: number
      inProgressGoals: number
      pendingGoals: number
      totalTargetTime: number
      totalActualTime: number
      totalTargetValue: number
      totalActualValue: number
      timeVarianceSum: number
    }

    const staffMap = new Map<number, StaffAccumulator>()

    rows.forEach((row) => {
      if (row.STAFF_ID === null) {
        return
      }

      const staffId = Number(row.STAFF_ID)
      let entry = staffMap.get(staffId)

      if (!entry) {
        entry = {
          staffId,
          staffName:
            this.normalizePersonName(row.STAFF_NAME) ?? 'Sin colaborador',
          modules: new Set<string>(),
          assignedGoals: 0,
          completedGoals: 0,
          completedOnTime: 0,
          completedLate: 0,
          inProgressGoals: 0,
          pendingGoals: 0,
          totalTargetTime: 0,
          totalActualTime: 0,
          totalTargetValue: 0,
          totalActualValue: 0,
          timeVarianceSum: 0,
        }
        staffMap.set(staffId, entry)
      }

      const staffModuleName =
        row.STAFF_MODULE_NAME ??
        (row.STAFF_MODULE_ID !== null ? `Módulo ${row.STAFF_MODULE_ID}` : 'Sin modulo')
      entry.modules.add(staffModuleName)

      const staffTargetValue = Number(row.STAFF_TARGET_VALUE ?? 0)
      const staffActualValue = Number(row.STAFF_ACTUAL_VALUE ?? 0)
      const staffActualTime = Number(row.STAFF_ACTUAL_TIME ?? 0)
      const moduleTargetValue = Number(row.MODULE_TARGET_VALUE ?? 0)

      const moduleKey = this.buildGoalModuleKey(
        row.GOAL_MODULE_ID !== null ? Number(row.GOAL_MODULE_ID) : null,
        row.PERIOD !== null ? Number(row.PERIOD) : null
      )
      const moduleData = moduleDetailMap.get(moduleKey)
      const moduleTargetTime = moduleData?.targetTime ?? 0
      const effectiveModuleTargetValue =
        moduleData?.targetValue ?? moduleTargetValue

      const targetTimeShare =
        effectiveModuleTargetValue > 0 && staffTargetValue > 0
          ? (moduleTargetTime * staffTargetValue) /
            effectiveModuleTargetValue
          : 0

      entry.assignedGoals += 1
      entry.totalTargetValue += staffTargetValue
      entry.totalActualValue += staffActualValue
      entry.totalTargetTime += targetTimeShare
      entry.totalActualTime += staffActualTime
      entry.timeVarianceSum += staffActualTime - targetTimeShare

      const completed =
        staffTargetValue > 0 && staffActualValue >= staffTargetValue

      if (completed) {
        entry.completedGoals += 1
        const isLate =
          targetTimeShare > 0 && staffActualTime > targetTimeShare
        if (isLate) {
          entry.completedLate += 1
        } else {
          entry.completedOnTime += 1
        }
      } else if (staffActualValue > 0) {
        entry.inProgressGoals += 1
      } else {
        entry.pendingGoals += 1
      }
    })

    sessionSecondsByStaff.forEach((seconds, staffId) => {
      if (!seconds) return
      const entry = staffMap.get(staffId)
      if (!entry) return
      const hours = seconds / 3600
      entry.totalActualTime += hours
      entry.timeVarianceSum += hours
    })

    manualSecondsByStaff.forEach(({ seconds }, staffId) => {
      if (!seconds) return
      const entry = staffMap.get(staffId)
      if (!entry) return
      const hours = seconds / 3600
      entry.totalActualTime += hours
      entry.timeVarianceSum += hours
    })

    const employees = Array.from(staffMap.values())
      .map((entry) => {
        const completionRate = this.calculateCompletionRate(
          entry.completedGoals,
          entry.assignedGoals
        )
        const averageTargetTime =
          entry.assignedGoals > 0
            ? this.roundNumber(entry.totalTargetTime / entry.assignedGoals)
            : null
        const averageActualTime =
          entry.completedGoals > 0
            ? this.roundNumber(entry.totalActualTime / entry.completedGoals)
            : entry.assignedGoals > 0
            ? this.roundNumber(entry.totalActualTime / entry.assignedGoals)
            : null
        const averageTimeVariance =
          entry.assignedGoals > 0
            ? this.roundNumber(entry.timeVarianceSum / entry.assignedGoals)
            : null
        const efficiency =
          entry.totalTargetTime > 0
            ? this.roundNumber(
                (entry.totalActualTime / entry.totalTargetTime) * 100
              )
            : null

        return {
          staffId: entry.staffId,
          staffName: entry.staffName,
          modules: Array.from(entry.modules).sort(),
          assignedGoals: entry.assignedGoals,
          completedGoals: entry.completedGoals,
          completionRate,
          completedOnTime: entry.completedOnTime,
          completedLate: entry.completedLate,
          inProgressGoals: entry.inProgressGoals,
          pendingGoals: entry.pendingGoals,
          totalTargetTime: this.roundNumber(entry.totalTargetTime),
          totalActualTime: this.roundNumber(entry.totalActualTime),
          totalTargetValue: this.roundNumber(entry.totalTargetValue),
          totalActualValue: this.roundNumber(entry.totalActualValue),
          averageTargetTime,
          averageActualTime,
          averageTimeVariance,
          efficiency,
        }
      })
      .sort((a, b) => {
        const rateA = a.completionRate ?? -Infinity
        const rateB = b.completionRate ?? -Infinity
        if (rateA === rateB) {
          return b.completedGoals - a.completedGoals
        }
        return rateB - rateA
      })

    return employees
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
    return this.roundNumber(sum / compliances.length)
  }

  private calculateCompletionRate(
    completed: number,
    total: number
  ): number | null {
    if (!total) {
      return null
    }

    return this.roundNumber((completed / total) * 100)
  }

  private average(
    values: number[],
    options: { allowZero?: boolean; allowNegative?: boolean } = {}
  ): number | null {
    const { allowZero = true, allowNegative = false } = options

    const valid = values.filter((value) => {
      if (!Number.isFinite(value)) {
        return false
      }

      if (!allowNegative && value < 0) {
        return false
      }

      if (!allowZero && value === 0) {
        return false
      }

      return true
    })

    if (!valid.length) {
      return null
    }

    const sum = valid.reduce((acc, value) => acc + value, 0)
    return this.roundNumber(sum / valid.length)
  }

  private roundNumber(value: number, decimals = 2): number {
    if (!Number.isFinite(value)) {
      return 0
    }

    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
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

  private async getModuleTopPerformers(
    filters: DashboardSummaryFilters,
    limitPerModule = 3
  ): Promise<ModuleTopPerformer[]> {
    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const clause = `${evaluationWhere.clause} AND e."OVERALL_SCORE" IS NOT NULL`

    const sql = `
      WITH module_scores AS (
        SELECT
          e."MODULE_ID" AS "MODULE_ID",
          m."DESCRIPTION" AS "MODULE_NAME",
          e."STAFF_ID" AS "STAFF_ID",
          TRIM(
            COALESCE(s."NAME", '')
            || ' '
            || COALESCE(s."LAST_NAME", '')
          ) AS "STAFF_NAME",
          AVG(e."OVERALL_SCORE")::numeric AS "AVERAGE_SCORE",
          COUNT(*)::int AS "EVALUATION_COUNT",
          MAX(COALESCE(e."UPDATED_AT", e."CREATED_AT")) AS "LAST_EVALUATION"
        FROM public."EVALUATION" e
        LEFT JOIN public."MODULE" m ON m."MODULE_ID" = e."MODULE_ID"
        LEFT JOIN public."STAFF" s ON s."STAFF_ID" = e."STAFF_ID"
        ${clause}
        GROUP BY
          e."MODULE_ID",
          m."DESCRIPTION",
          e."STAFF_ID",
          s."NAME",
          s."LAST_NAME"
      ),
      ranked AS (
        SELECT
          ms.*,
          ROW_NUMBER() OVER (
            PARTITION BY ms."MODULE_ID"
            ORDER BY
              ms."AVERAGE_SCORE" DESC NULLS LAST,
              ms."EVALUATION_COUNT" DESC,
              ms."LAST_EVALUATION" DESC NULLS LAST,
              ms."STAFF_NAME" ASC
          ) AS "RANK"
        FROM module_scores ms
      )
      SELECT
        "MODULE_ID",
        "MODULE_NAME",
        "STAFF_ID",
        "STAFF_NAME",
        "AVERAGE_SCORE",
        "EVALUATION_COUNT",
        "LAST_EVALUATION",
        "RANK"
      FROM ranked
      WHERE "RANK" <= :limitPerModule
      ORDER BY "MODULE_NAME" NULLS LAST, "RANK"
    `

    const query = preparePostgresQuery(sql, {
      ...evaluationWhere.params,
      limitPerModule,
    })

    const rows = await queryRunner<{
      MODULE_ID: number | null
      MODULE_NAME: string | null
      STAFF_ID: number | null
      STAFF_NAME: string | null
      AVERAGE_SCORE: string | number | null
      EVALUATION_COUNT: number
      LAST_EVALUATION: Date | null
      RANK: number
    }>(query.query, query.values)

    return rows.map((row) => ({
      moduleId: row.MODULE_ID !== null ? Number(row.MODULE_ID) : null,
      moduleName: this.normalizeModuleName(row.MODULE_NAME),
      staffId: row.STAFF_ID !== null ? Number(row.STAFF_ID) : null,
      staffName: this.normalizePersonName(row.STAFF_NAME),
      averageScore:
        row.AVERAGE_SCORE !== null && row.AVERAGE_SCORE !== undefined
          ? Number(Number(row.AVERAGE_SCORE).toFixed(2))
          : null,
      evaluationsCompleted: Number(row.EVALUATION_COUNT ?? 0),
      lastEvaluationAt: row.LAST_EVALUATION
        ? row.LAST_EVALUATION.toISOString()
        : null,
      rank: Number(row.RANK ?? 0),
    }))
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

  private async getDailySummary(
    filters: DashboardSummaryFilters
  ): Promise<DashboardDailySummary> {
    const params: Record<string, unknown> = {}

    const targetConditions: string[] = [
      `gdt."STATE" = 'A'`,
      `gm."STATE" = 'A'`,
      `gdt."TARGET_DATE" = CURRENT_DATE`,
    ]

    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      targetConditions.push('gm."MODULE_ID" = :moduleId')
      params.moduleId = filters.moduleId
    }

    if (filters.periodStart !== undefined && filters.periodStart !== null) {
      targetConditions.push('gdt."PERIOD" >= :periodStart')
      params.periodStart = filters.periodStart
    }

    if (filters.periodEnd !== undefined && filters.periodEnd !== null) {
      targetConditions.push('gdt."PERIOD" <= :periodEnd')
      params.periodEnd = filters.periodEnd
    }

    const targetWhere = `WHERE ${targetConditions.join(' AND ')}`

    const progressConditions: string[] = [
      `gp."STATE" = 'A'`,
      `gp."GOAL_MODULE_ID" IS NOT NULL`,
      `DATE(COALESCE(gp."UPDATED_AT", gp."CREATED_AT")) = CURRENT_DATE`,
    ]

    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      progressConditions.push('gp."MODULE_ID" = :moduleId')
    }

    if (filters.periodStart !== undefined && filters.periodStart !== null) {
      progressConditions.push('gp."PERIOD" >= :periodStart')
    }

    if (filters.periodEnd !== undefined && filters.periodEnd !== null) {
      progressConditions.push('gp."PERIOD" <= :periodEnd')
    }

    const progressWhere = `WHERE ${progressConditions.join(' AND ')}`

    const sql = `
      WITH DAILY_TARGETS AS (
        SELECT
          gdt."GOAL_MODULE_ID",
          gm."MODULE_ID",
          gdt."PERIOD",
          SUM(COALESCE(gdt."TARGET_VALUE", 0)) AS "TARGET_VALUE",
          SUM(COALESCE(gdt."TARGET_TIME", 0)) AS "TARGET_TIME"
        FROM public."GOAL_DAILY_TARGET" gdt
        INNER JOIN public."GOAL_X_MODULE" gm
          ON gm."GOAL_MODULE_ID" = gdt."GOAL_MODULE_ID"
        ${targetWhere}
        GROUP BY gdt."GOAL_MODULE_ID", gm."MODULE_ID", gdt."PERIOD"
      ),
      PROGRESS AS (
        SELECT
          gp."GOAL_MODULE_ID",
          gp."MODULE_ID",
          gp."PERIOD",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'module'
              THEN COALESCE(gp."ACTUAL_VALUE", 0)
              ELSE 0
            END
          ) AS "MODULE_VALUE",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'module'
              THEN COALESCE(gp."ACTUAL_TIME", 0)
              ELSE 0
            END
          ) AS "MODULE_TIME",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'individual'
              THEN COALESCE(gp."ACTUAL_VALUE", 0)
              ELSE 0
            END
          ) AS "INDIVIDUAL_VALUE",
          SUM(
            CASE
              WHEN gp."SCOPE" = 'individual'
              THEN COALESCE(gp."ACTUAL_TIME", 0)
              ELSE 0
            END
          ) AS "INDIVIDUAL_TIME"
        FROM public."GOAL_PROGRESS" gp
        ${progressWhere}
        GROUP BY gp."GOAL_MODULE_ID", gp."MODULE_ID", gp."PERIOD"
      )
      SELECT
        COALESCE(SUM(dt."TARGET_VALUE"), 0) AS "TARGET_VALUE",
        COALESCE(SUM(dt."TARGET_TIME"), 0) AS "TARGET_TIME",
        COALESCE(
          SUM(
            COALESCE(
              NULLIF(pr."MODULE_VALUE", 0),
              pr."INDIVIDUAL_VALUE",
              0
            )
          ),
          0
        ) AS "ACTUAL_VALUE",
        COALESCE(
          SUM(
            COALESCE(
              NULLIF(pr."MODULE_TIME", 0),
              pr."INDIVIDUAL_TIME",
              0
            )
          ),
          0
        ) AS "ACTUAL_TIME",
        COUNT(DISTINCT dt."GOAL_MODULE_ID") AS "ACTIVE_GOALS",
        COUNT(
          DISTINCT CASE
            WHEN dt."TARGET_VALUE" > 0
             AND COALESCE(
                   NULLIF(pr."MODULE_VALUE", 0),
                   pr."INDIVIDUAL_VALUE",
                   0
                 ) >= dt."TARGET_VALUE"
            THEN dt."GOAL_MODULE_ID"
            ELSE NULL
          END
        ) AS "COMPLETED_GOALS"
      FROM DAILY_TARGETS dt
      LEFT JOIN PROGRESS pr
        ON pr."GOAL_MODULE_ID" = dt."GOAL_MODULE_ID"
       AND pr."PERIOD" = dt."PERIOD"
    `

    const summaryQuery = preparePostgresQuery(sql, params)
    const [summaryRow] = await queryRunner<{
      TARGET_VALUE: string | number | null
      TARGET_TIME: string | number | null
      ACTUAL_VALUE: string | number | null
      ACTUAL_TIME: string | number | null
      ACTIVE_GOALS: number | null
      COMPLETED_GOALS: number | null
    }>(summaryQuery.query, summaryQuery.values)

    const targetValue = Number(summaryRow?.TARGET_VALUE ?? 0)
    const actualValue = Number(summaryRow?.ACTUAL_VALUE ?? 0)
    const targetTime = Number(summaryRow?.TARGET_TIME ?? 0)
    const baseActualTime = Number(summaryRow?.ACTUAL_TIME ?? 0)
    const activeGoals = Number(summaryRow?.ACTIVE_GOALS ?? 0)
    const completedGoals = Number(summaryRow?.COMPLETED_GOALS ?? 0)

    const sessionConditions: string[] = [
      `sess."STATE" = 'A'`,
      `DATE(sess."STARTED_AT") = CURRENT_DATE`,
    ]
    const sessionParams: Record<string, unknown> = {}
    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      sessionConditions.push('sess."MODULE_ID" = :sessionModuleId')
      sessionParams.sessionModuleId = filters.moduleId
    }
    const sessionWhere = `WHERE ${sessionConditions.join(' AND ')}`
    const sessionSql = `
      SELECT
        COALESCE(
          SUM(
            COALESCE(sess."ACCUMULATED_SECONDS", 0)
            +
            CASE
              WHEN sess."IS_ACTIVE" = TRUE THEN GREATEST(
                EXTRACT(
                  EPOCH FROM (
                    CURRENT_TIMESTAMP
                    - COALESCE(sess."LAST_RESUMED_AT", sess."STARTED_AT")
                  )
                ),
                0
              )
              ELSE 0
            END
          ),
          0
        ) AS "SECONDS"
      FROM public."GOAL_TASK_SESSION" sess
      ${sessionWhere}
    `
    const sessionQuery = preparePostgresQuery(sessionSql, sessionParams)
    const [sessionRow] = await queryRunner<{ SECONDS: string | number | null }>(
      sessionQuery.query,
      sessionQuery.values
    )
    const sessionHours = Number(sessionRow?.SECONDS ?? 0) / 3600

    const supervisorConditions: string[] = [
      `gtc."STATE" = 'A'`,
      `DATE(gtc."RECORDED_AT") = CURRENT_DATE`,
      `gtc."METADATA" IS NOT NULL`,
      `gtc."METADATA" ? 'timeMinutes'`,
    ]
    const supervisorParams: Record<string, unknown> = {}
    if (filters.moduleId !== undefined && filters.moduleId !== null) {
      supervisorConditions.push('gtc."MODULE_ID" = :supervisorModuleId')
      supervisorParams.supervisorModuleId = filters.moduleId
    }
    const supervisorSql = `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN (gtc."METADATA"->>'timeMinutes') ~ '^[-+]?[0-9]+(\\.[0-9]+)?$'
              THEN (gtc."METADATA"->>'timeMinutes')::numeric
              ELSE 0
            END
          ),
          0
        ) AS "MINUTES"
      FROM public."GOAL_TASK_COMPLETION" gtc
      WHERE ${supervisorConditions.join(' AND ')}
    `
    const supervisorQuery = preparePostgresQuery(
      supervisorSql,
      supervisorParams
    )
    const [supervisorRow] = await queryRunner<{
      MINUTES: string | number | null
    }>(supervisorQuery.query, supervisorQuery.values)
    const supervisorHours = Number(supervisorRow?.MINUTES ?? 0) / 60

    const actualTime = baseActualTime + sessionHours + supervisorHours

    const completionRate =
      targetValue > 0
        ? this.roundNumber(
            Math.min((actualValue / targetValue) * 100, 150),
            1
          )
        : null

    const timeVariance =
      targetTime === 0 && actualTime === 0
        ? null
        : this.roundNumber(actualTime - targetTime, 1)

    const evaluationWhere = this.buildEvaluationWhereClause(filters)
    const evaluationClause = `${evaluationWhere.clause} AND DATE(COALESCE(e."UPDATED_AT", e."CREATED_AT")) = CURRENT_DATE`
    const evaluationSql = `
      SELECT
        SUM(
          CASE WHEN e."OVERALL_SCORE" IS NOT NULL THEN 1 ELSE 0 END
        )::int AS "COMPLETED_TODAY"
      FROM public."EVALUATION" e
      ${evaluationClause}
    `
    const evaluationQuery = preparePostgresQuery(
      evaluationSql,
      evaluationWhere.params
    )
    const [evaluationRow] = await queryRunner<{
      COMPLETED_TODAY: number
    }>(evaluationQuery.query, evaluationQuery.values)

    const activitySql = `
      SELECT COUNT(*)::int AS "COUNT"
      FROM public."ACTIVITY_LOG" log
      WHERE DATE(log."CREATED_AT") = CURRENT_DATE
    `
    const [activityRow] = await queryRunner<{
      COUNT: number
    }>(activitySql)

    return {
      date: new Date().toISOString(),
      targetValue,
      actualValue,
      completionRate,
      targetTime,
      actualTime,
      timeVariance,
      activeGoals,
      completedGoals,
      evaluationsCompleted: Number(evaluationRow?.COMPLETED_TODAY ?? 0),
      activityCount: Number(activityRow?.COUNT ?? 0),
    }
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
      SELECT DISTINCT gm."PERIOD" AS "PERIOD"
      FROM public."GOAL_X_MODULE" gm
      WHERE gm."STATE" = 'A' AND gm."PERIOD" IS NOT NULL
      ORDER BY gm."PERIOD" DESC
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

  private async loadSessions(filters: {
    period?: number
    periodStart?: number
    periodEnd?: number
    moduleId?: number
  }): Promise<{ session: GoalTaskSession; seconds: number }[]> {
    const qb = this.goalTaskSessionRepository
      .createQueryBuilder('session')
      .where('session."STATE" = :state', { state: 'A' })

    if (Number.isInteger(filters.period)) {
      qb.andWhere('session."PERIOD" = :period', { period: filters.period })
    } else {
      if (Number.isInteger(filters.periodStart)) {
        qb.andWhere('session."PERIOD" >= :periodStart', {
          periodStart: filters.periodStart,
        })
      }
      if (Number.isInteger(filters.periodEnd)) {
        qb.andWhere('session."PERIOD" <= :periodEnd', {
          periodEnd: filters.periodEnd,
        })
      }
    }
    if (Number.isInteger(filters.moduleId)) {
      qb.andWhere('session."MODULE_ID" = :moduleId', {
        moduleId: filters.moduleId,
      })
    }

    const records = await qb.getMany()
    const now = new Date()

    return records.map((session) => {
      let seconds = Number(session.ACCUMULATED_SECONDS ?? 0)
      if (session.IS_ACTIVE) {
        const resumed = session.LAST_RESUMED_AT ?? session.STARTED_AT
        if (resumed) {
          seconds += Math.max(0, (now.getTime() - resumed.getTime()) / 1000)
        }
      }

      return { session, seconds }
    })
  }

  private async getModuleProgressHours(filters: {
    period?: number
    moduleId?: number
  }): Promise<Map<number | null, number>> {
    const conditions = [
      `gp."STATE" = 'A'`,
      `gp."SCOPE" = 'module'`,
      `gp."ACTUAL_TIME" IS NOT NULL`,
      `gp."ACTUAL_TIME" <> 0`,
    ]
    const params: Record<string, unknown> = {}

    if (Number.isInteger(filters.period)) {
      conditions.push('gp."PERIOD" = :progressPeriod')
      params.progressPeriod = filters.period
    }
    if (Number.isInteger(filters.moduleId)) {
      conditions.push(
        'COALESCE(gp."MODULE_ID", gm."MODULE_ID") = :progressModuleId'
      )
      params.progressModuleId = filters.moduleId
    }

    const sql = `
      SELECT
        COALESCE(gp."MODULE_ID", gm."MODULE_ID") AS "MODULE_ID",
        SUM(COALESCE(gp."ACTUAL_TIME", 0)) AS "HOURS"
      FROM public."GOAL_PROGRESS" gp
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gp."GOAL_MODULE_ID"
      WHERE ${conditions.join(' AND ')}
        AND (gp."MODULE_ID" IS NOT NULL OR gm."MODULE_ID" IS NOT NULL)
      GROUP BY COALESCE(gp."MODULE_ID", gm."MODULE_ID")
    `

    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{
      MODULE_ID: number | null
      HOURS: string | number | null
    }>(query.query, query.values)

    const map = new Map<number | null, number>()
    rows.forEach((row) => {
      const moduleId =
        row.MODULE_ID !== null && row.MODULE_ID !== undefined
          ? Number(row.MODULE_ID)
          : null
      const hours = Number(row.HOURS ?? 0)
      if (!hours) return
      map.set(moduleId, hours)
    })

    return map
  }

  private async getStaffManualSeconds(filters: {
    period?: number
    moduleId?: number
    periodStart?: number
    periodEnd?: number
  }): Promise<Map<number, { seconds: number; moduleId: number | null }>> {
    const map = new Map<number, { seconds: number; moduleId: number | null }>()

    const addPeriodFilter = (
      column: string,
      prefix: string,
      conditions: string[],
      params: Record<string, unknown>
    ) => {
      if (Number.isInteger(filters.period)) {
        conditions.push(`${column} = :${prefix}`)
        params[prefix] = filters.period
      } else {
        if (Number.isInteger(filters.periodStart)) {
          conditions.push(`${column} >= :${prefix}Start`)
          params[`${prefix}Start`] = filters.periodStart
        }
        if (Number.isInteger(filters.periodEnd)) {
          conditions.push(`${column} <= :${prefix}End`)
          params[`${prefix}End`] = filters.periodEnd
        }
      }
    }

    const addEntry = (staffId: number, moduleId: number | null, seconds: number) => {
      if (!seconds || !Number.isFinite(seconds)) return
      const existing =
        map.get(staffId) ??
        (() => {
          const entry = { seconds: 0, moduleId }
          map.set(staffId, entry)
          return entry
        })()
      existing.seconds += seconds
      if (moduleId !== null && existing.moduleId === null) {
        existing.moduleId = moduleId
      }
    }

    const progressConditions = [
      `gp."STATE" = 'A'`,
      `gp."SCOPE" = 'individual'`,
      `gp."STAFF_ID" IS NOT NULL`,
      `gp."ACTUAL_TIME" IS NOT NULL`,
      `gp."ACTUAL_TIME" <> 0`,
    ]
    const progressParams: Record<string, unknown> = {}
    addPeriodFilter('gp."PERIOD"', 'staffProgressPeriod', progressConditions, progressParams)
    if (Number.isInteger(filters.moduleId)) {
      progressConditions.push(
        'COALESCE(gp."MODULE_ID", gm."MODULE_ID") = :staffProgressModuleId'
      )
      progressParams.staffProgressModuleId = filters.moduleId
    }

    const progressSql = `
      SELECT
        gp."STAFF_ID",
        COALESCE(gp."MODULE_ID", gm."MODULE_ID") AS "MODULE_ID",
        SUM(COALESCE(gp."ACTUAL_TIME", 0)) AS "HOURS"
      FROM public."GOAL_PROGRESS" gp
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gp."GOAL_MODULE_ID"
      WHERE ${progressConditions.join(' AND ')}
        AND (gp."MODULE_ID" IS NOT NULL OR gm."MODULE_ID" IS NOT NULL)
      GROUP BY gp."STAFF_ID", COALESCE(gp."MODULE_ID", gm."MODULE_ID")
    `
    const progressQuery = preparePostgresQuery(progressSql, progressParams)
    const progressRows = await queryRunner<{
      STAFF_ID: number
      MODULE_ID: number | null
      HOURS: string | number | null
    }>(progressQuery.query, progressQuery.values)

    progressRows.forEach((row) => {
      const staffId = Number(row.STAFF_ID)
      const moduleId =
        row.MODULE_ID !== null && row.MODULE_ID !== undefined
          ? Number(row.MODULE_ID)
          : null
      const hours = Number(row.HOURS ?? 0)
      addEntry(staffId, moduleId, hours * 3600)
    })

    const metadataConditions = [
      `gtc."STATE" = 'A'`,
      `gtc."STAFF_ID" IS NOT NULL`,
      `gtc."METADATA" IS NOT NULL`,
      `gtc."METADATA" ? 'timeMinutes'`,
    ]
    const metadataParams: Record<string, unknown> = {}
    addPeriodFilter('gtc."PERIOD"', 'staffMetaPeriod', metadataConditions, metadataParams)
    if (Number.isInteger(filters.moduleId)) {
      metadataConditions.push(
        'COALESCE(gtc."MODULE_ID", gm."MODULE_ID") = :staffMetaModuleId'
      )
      metadataParams.staffMetaModuleId = filters.moduleId
    }

    const metadataSql = `
      SELECT
        gtc."STAFF_ID",
        COALESCE(gtc."MODULE_ID", gm."MODULE_ID") AS "MODULE_ID",
        SUM(
          CASE
            WHEN (gtc."METADATA"->>'timeMinutes') ~ '^[-+]?[0-9]+(\\.[0-9]+)?$'
            THEN (gtc."METADATA"->>'timeMinutes')::numeric
            ELSE 0
          END
        ) AS "MINUTES"
      FROM public."GOAL_TASK_COMPLETION" gtc
      LEFT JOIN public."GOAL_TASK" gt
        ON gt."GOAL_TASK_ID" = gtc."GOAL_TASK_ID"
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gt."GOAL_MODULE_ID"
      WHERE ${metadataConditions.join(' AND ')}
        AND (gtc."MODULE_ID" IS NOT NULL OR gm."MODULE_ID" IS NOT NULL)
      GROUP BY gtc."STAFF_ID", COALESCE(gtc."MODULE_ID", gm."MODULE_ID")
    `

    const metadataQuery = preparePostgresQuery(metadataSql, metadataParams)
    const metadataRows = await queryRunner<{
      STAFF_ID: number
      MODULE_ID: number | null
      MINUTES: string | number | null
    }>(metadataQuery.query, metadataQuery.values)

    metadataRows.forEach((row) => {
      const staffId = Number(row.STAFF_ID)
      const moduleId =
        row.MODULE_ID !== null && row.MODULE_ID !== undefined
          ? Number(row.MODULE_ID)
          : null
      const minutes = Number(row.MINUTES ?? 0)
      addEntry(staffId, moduleId, minutes * 60)
    })

    return map
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
