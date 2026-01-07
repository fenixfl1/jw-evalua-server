import { In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { ModuleEfficiency } from '@src/entity/ModuleEfficiency'
import { ProcessAudit } from '@src/entity/ProcessAudit'
import { GoalTaskSession } from '@src/entity/GoalTaskSession'
import { Staff } from '@src/entity/Staff'
import { Goal } from '@src/entity/Goal'
import { GoalTask } from '@src/entity/GoalTask'
import { ApiResponse, SessionInfo } from '@src/types/api.types'
import { BadRequestError } from '@src/errors/http.error'
import { queryRunner } from '@src/helpers/query-utils'
import { preparePostgresQuery } from '../middlewares/prepare-postgres-query'

interface RecordEfficiencyPayload {
  MODULE_ID: number
  PERIOD: number
  TOTAL_UNITS: number
  SAM: number
  MINUTES_WORKED: number
  NOTES?: string | null
}

interface ProcessAuditEntryPayload {
  operation?: string
  operator?: string
  timeSlot?: string
  samples?: number
  defects?: { type: string; count: number }[]
  comments?: string
}

interface CreateProcessAuditPayload {
  MODULE_ID: number
  AUDIT_DATE: string
  SHIFT?: string | null
  STYLE?: string | null
  SUPERVISOR?: string | null
  AUDITOR?: string | null
  ENTRIES: ProcessAuditEntryPayload[]
  COMMENTS?: string | null
}

export class ProductionMetricsService extends BaseService {
  private efficiencyRepository: Repository<ModuleEfficiency>
  private processAuditRepository: Repository<ProcessAudit>
  private goalTaskSessionRepository: Repository<GoalTaskSession>
  private goalRepository: Repository<Goal>
  private goalTaskRepository: Repository<GoalTask>

  constructor() {
    super()
    this.efficiencyRepository = this.dataSource.getRepository(ModuleEfficiency)
    this.processAuditRepository = this.dataSource.getRepository(ProcessAudit)
    this.goalTaskSessionRepository =
      this.dataSource.getRepository(GoalTaskSession)
    this.goalRepository = this.dataSource.getRepository(Goal)
    this.goalTaskRepository = this.dataSource.getRepository(GoalTask)
  }

  private calculateActiveSeconds(start: Date | null, end: Date): number {
    if (!start) return 0
    return Math.max(0, (end.getTime() - start.getTime()) / 1000)
  }

  private normalizeNumber(value: unknown, field: string): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new BadRequestError(`Valor inválido para ${field}.`)
    }
    return parsed
  }

  @CatchServiceError()
  async recordEfficiency(
    payload: RecordEfficiencyPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const moduleId = Number(payload.MODULE_ID)
    const period = Number(payload.PERIOD)

    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }
    if (!Number.isInteger(period) || period <= 0) {
      throw new BadRequestError('PERIOD inválido.')
    }

    const totalUnits = this.normalizeNumber(payload.TOTAL_UNITS, 'TOTAL_UNITS')
    const sam = this.normalizeNumber(payload.SAM, 'SAM')

    const { minutesWorked } = await this.calculateModuleWorkedTime(
      moduleId,
      period
    )

    if (minutesWorked <= 0) {
      throw new BadRequestError(
        'No hay tiempo trabajado registrado para este módulo en el periodo seleccionado.'
      )
    }

    const efficiency = Number(
      (((totalUnits * sam) / minutesWorked) * 100).toFixed(2)
    )

    const record = this.efficiencyRepository.create({
      MODULE_ID: moduleId,
      PERIOD: period,
      TOTAL_UNITS: totalUnits,
      SAM: sam,
      MINUTES_WORKED: minutesWorked,
      EFFICIENCY_PERCENT: efficiency,
      NOTES: payload.NOTES?.trim() || null,
      CREATED_BY: session.userId,
    })

    await this.efficiencyRepository.save(record)

    return this.success({
      data: record,
      message: 'Eficiencia registrada correctamente.',
    })
  }

  @CatchServiceError()
  async getEfficiency(
    moduleId?: number,
    period?: number
  ): Promise<ApiResponse> {
    if (
      moduleId !== undefined &&
      (!Number.isInteger(moduleId) || moduleId <= 0)
    ) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const where: Record<string, unknown> = {
      STATE: 'A',
    }
    if (moduleId !== undefined) {
      where.MODULE_ID = moduleId
    }
    if (Number.isInteger(period)) {
      where.PERIOD = period
    }

    const data = await this.efficiencyRepository.find({
      where,
      order: { CREATED_AT: 'DESC' as never },
      take: 20,
    })

    if (!data.length) {
      return this.noContent()
    }

    return this.success({ data })
  }

  @CatchServiceError()
  async createProcessAudit(
    payload: CreateProcessAuditPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const moduleId = Number(payload.MODULE_ID)
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }
    if (!payload.AUDIT_DATE) {
      throw new BadRequestError('AUDIT_DATE es requerido.')
    }

    const auditDateInput = String(payload.AUDIT_DATE).trim()
    const auditDateMatch =
      /^(\d{4})-(\d{2})-(\d{2})/.exec(auditDateInput)
    if (!auditDateMatch) {
      throw new BadRequestError('AUDIT_DATE inválido.')
    }
    const year = Number(auditDateMatch[1])
    const month = Number(auditDateMatch[2])
    const day = Number(auditDateMatch[3])
    const auditDateCheck = new Date(year, month - 1, day)
    if (
      Number.isNaN(auditDateCheck.getTime()) ||
      auditDateCheck.getFullYear() !== year ||
      auditDateCheck.getMonth() !== month - 1 ||
      auditDateCheck.getDate() !== day
    ) {
      throw new BadRequestError('AUDIT_DATE inválido.')
    }
    const auditDate = `${auditDateMatch[1]}-${auditDateMatch[2]}-${auditDateMatch[3]}`

    const entries = Array.isArray(payload.ENTRIES)
      ? payload.ENTRIES.map((entry) => ({
          operation: entry.operation || null,
          operator: entry.operator || null,
          timeSlot: entry.timeSlot?.trim() || null,
          samples: this.normalizeOptionalNumber(entry.samples),
          defects: Array.isArray(entry.defects)
            ? entry.defects
                .filter(
                  (defect) =>
                    defect?.type && Number.isFinite(Number(defect?.count ?? 0))
                )
                .map((defect) => ({
                  type: defect.type.trim(),
                  count: Number(defect.count ?? 0),
                }))
            : [],
          comments: entry.comments?.trim() || null,
        })).filter(
          (entry) =>
            entry.operation ||
            entry.operator ||
            entry.defects.length ||
            entry.samples
        )
      : []

    if (!entries.length) {
      throw new BadRequestError('Debe registrar al menos una observación.')
    }

    const record = this.processAuditRepository.create({
      MODULE_ID: moduleId,
      AUDIT_DATE: auditDate,
      SHIFT: payload.SHIFT?.trim() || null,
      STYLE: payload.STYLE || null,
      SUPERVISOR: payload.SUPERVISOR || null,
      AUDITOR: payload.AUDITOR || null,
      ENTRIES: entries,
      COMMENTS: payload.COMMENTS?.trim() || null,
      CREATED_BY: session.userId,
    })

    await this.processAuditRepository.save(record)

    return this.success({
      data: record,
      message: 'Auditoría registrada correctamente.',
    })
  }

  @CatchServiceError()
  async getProcessAudits(
    moduleId: number | undefined,
    filters: { startDate?: string; endDate?: string }
  ): Promise<ApiResponse> {
    if (
      moduleId !== undefined &&
      (!Number.isInteger(moduleId) || moduleId <= 0)
    ) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const qb = this.processAuditRepository
      .createQueryBuilder('audit')
      .where('audit."STATE" = :state', { state: 'A' })

    if (moduleId !== undefined) {
      qb.andWhere('audit."MODULE_ID" = :moduleId', { moduleId })
    }

    if (filters.startDate) {
      qb.andWhere('audit."AUDIT_DATE" >= :startDate', {
        startDate: filters.startDate,
      })
    }
    if (filters.endDate) {
      qb.andWhere('audit."AUDIT_DATE" <= :endDate', {
        endDate: filters.endDate,
      })
    }

    const data = await qb
      .orderBy('audit."AUDIT_DATE"', 'DESC')
      .limit(50)
      .getMany()

    if (!data.length) {
      return this.noContent()
    }

    const staffIds = new Set<number>()
    const userIds = new Set<number>()
    const goalIds = new Set<number>()
    const goalTaskIds = new Set<number>()
    const collectStaffId = (value: unknown) => {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) {
        staffIds.add(parsed)
      }
    }
    const collectUserId = (value: unknown) => {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) {
        userIds.add(parsed)
      }
    }

    data.forEach((audit) => {
      collectUserId(audit.SUPERVISOR)
      collectUserId(audit.AUDITOR)
      const styleId = Number(audit.STYLE)
      if (Number.isFinite(styleId) && styleId > 0) {
        goalIds.add(styleId)
      }
      if (Array.isArray(audit.ENTRIES)) {
        audit.ENTRIES.forEach((entry) => {
          collectStaffId(entry?.operator)
          const operationId = Number(entry?.operation)
          if (Number.isFinite(operationId) && operationId > 0) {
            goalTaskIds.add(operationId)
          }
        })
      }
    })

    let staffNameMap = new Map<number, string>()
    if (staffIds.size) {
      const staffRecords = await this.staffRepository.find({
        where: { STAFF_ID: In(Array.from(staffIds)) },
      })
      staffNameMap = new Map(
        staffRecords.map((staff) => [
          staff.STAFF_ID,
          `${staff.NAME ?? ''} ${staff.LAST_NAME ?? ''}`.trim() ||
            `Colaborador ${staff.STAFF_ID}`,
        ])
      )
    }

    let userNameMap = new Map<number, string>()
    if (userIds.size) {
      const users = await this.userRepository.find({
        where: { USER_ID: In(Array.from(userIds)) },
        relations: ['STAFF'],
      })
      userNameMap = new Map(
        users.map((user) => {
          const staff = user.STAFF
          const staffName = staff
            ? `${staff.NAME ?? ''} ${staff.LAST_NAME ?? ''}`.trim()
            : ''
          const displayName =
            staffName ||
            user.USERNAME ||
            `Usuario ${user.USER_ID}`
          return [user.USER_ID, displayName]
        })
      )
    }

    let goalNameMap = new Map<number, string>()
    if (goalIds.size) {
      const goals = await this.goalRepository.find({
        select: ['GOAL_ID', 'DESCRIPTION'],
        where: { GOAL_ID: In(Array.from(goalIds)) },
      })
      goalNameMap = new Map(
        goals.map((goal) => [goal.GOAL_ID, goal.DESCRIPTION ?? `Estilo ${goal.GOAL_ID}`])
      )
    }

    let goalTaskDescriptionMap = new Map<number, string>()
    if (goalTaskIds.size) {
      const tasks = await this.goalTaskRepository.find({
        select: ['GOAL_TASK_ID', 'DESCRIPTION'],
        where: { GOAL_TASK_ID: In(Array.from(goalTaskIds)) },
      })
      goalTaskDescriptionMap = new Map(
        tasks.map((task) => [task.GOAL_TASK_ID, task.DESCRIPTION ?? `Operación ${task.GOAL_TASK_ID}`])
      )
    }

    const resolveStaffName = (value: unknown): string | null => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return value === null || value === undefined ? null : String(value)
      }
      return staffNameMap.get(parsed) ?? String(parsed)
    }

    const resolveUserName = (value: unknown): string | null => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return value === null || value === undefined ? null : String(value)
      }
      return userNameMap.get(parsed) ?? String(parsed)
    }

    const resolveGoalDescription = (value: unknown): string | null => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return value === null || value === undefined ? null : String(value)
      }
      return goalNameMap.get(parsed) ?? String(parsed)
    }

    const resolveGoalTaskDescription = (value: unknown): string | null => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return value === null || value === undefined ? null : String(value)
      }
      return goalTaskDescriptionMap.get(parsed) ?? String(parsed)
    }

    const enrichedData = data.map((audit) => ({
      ...audit,
      STYLE: resolveGoalDescription(audit.STYLE),
      SUPERVISOR: resolveUserName(audit.SUPERVISOR),
      AUDITOR: resolveUserName(audit.AUDITOR),
      ENTRIES: Array.isArray(audit.ENTRIES)
        ? audit.ENTRIES.map((entry) => ({
            ...entry,
            operator: resolveStaffName(entry?.operator),
            operation: resolveGoalTaskDescription(entry?.operation),
          }))
        : audit.ENTRIES,
    }))

    return this.success({ data: enrichedData })
  }

  @CatchServiceError()
  async getModuleWorkedMinutes(moduleId: number, period?: number) {
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const { minutesWorked, secondsWorked, activeSessions } =
      await this.calculateModuleWorkedTime(moduleId, period)
    const totalUnits = await this.calculateModuleCompletedUnits(
      moduleId,
      period
    )

    return this.success({
      data: { minutesWorked, secondsWorked, activeSessions, totalUnits },
      message: 'Tiempo trabajado calculado.',
    })
  }

  private normalizeOptionalNumber(
    value?: number | string | null
  ): number | null {
    if (value === null || value === undefined || value === '') {
      return null
    }
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new BadRequestError('Valor numérico inválido.')
    }
    return parsed
  }

  private async calculateModuleWorkedTime(moduleId: number, period?: number) {
    const qb = this.goalTaskSessionRepository
      .createQueryBuilder('session')
      .where('session."MODULE_ID" = :moduleId', { moduleId })
      .andWhere('session."STATE" = :state', { state: 'A' })

    if (Number.isInteger(period)) {
      qb.andWhere('session."PERIOD" = :period', { period })
    }

    const sessions = await qb.getMany()
    if (!sessions.length) {
      return { minutesWorked: 0, secondsWorked: 0, activeSessions: 0 }
    }

    const now = new Date()
    let secondsWorked = 0
    let activeSessions = 0

    sessions.forEach((session) => {
      let seconds = Number(session.ACCUMULATED_SECONDS ?? 0)

      if (session.IS_ACTIVE) {
        activeSessions += 1
        seconds += this.calculateActiveSeconds(
          session.LAST_RESUMED_AT ?? session.STARTED_AT,
          now
        )
      }

      secondsWorked += seconds
    })

    const manualSeconds = await this.getModuleManualSeconds(moduleId, period)
    secondsWorked += manualSeconds

    const minutesWorked = Number((secondsWorked / 60).toFixed(2))

    return { minutesWorked, secondsWorked, activeSessions }
  }

  private async getModuleManualSeconds(
    moduleId: number,
    period?: number
  ): Promise<number> {
    const params: Record<string, unknown> = { moduleId }
    const completionParams: Record<string, unknown> = { moduleId }

    const progressConditions = [
      `gp."STATE" = 'A'`,
      `gp."ACTUAL_TIME" IS NOT NULL`,
      `COALESCE(gp."MODULE_ID", gm."MODULE_ID") = :moduleId`,
    ]
    if (Number.isInteger(period)) {
      progressConditions.push('gp."PERIOD" = :progressPeriod')
      params.progressPeriod = period
    }

    const progressSql = `
      SELECT COALESCE(SUM(COALESCE(gp."ACTUAL_TIME", 0)), 0) AS "HOURS"
      FROM public."GOAL_PROGRESS" gp
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gp."GOAL_MODULE_ID"
      WHERE ${progressConditions.join(' AND ')}
    `
    const progressQuery = preparePostgresQuery(progressSql, params)
    const [progressRow] = await queryRunner<{ HOURS: string | number | null }>(
      progressQuery.query,
      progressQuery.values
    )
    const hoursFromProgress = Number(progressRow?.HOURS ?? 0)

    const completionConditions = [
      `gtc."STATE" = 'A'`,
      `gtc."METADATA" IS NOT NULL`,
      `gtc."METADATA" ? 'timeMinutes'`,
      `COALESCE(gtc."MODULE_ID", gm."MODULE_ID") = :moduleId`,
    ]
    if (Number.isInteger(period)) {
      completionConditions.push('gtc."PERIOD" = :completionPeriod')
      completionParams.completionPeriod = period
    }

    const completionSql = `
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
      LEFT JOIN public."GOAL_TASK" gt
        ON gt."GOAL_TASK_ID" = gtc."GOAL_TASK_ID"
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gt."GOAL_MODULE_ID"
      WHERE ${completionConditions.join(' AND ')}
    `
    const completionQuery = preparePostgresQuery(
      completionSql,
      completionParams
    )
    const [completionRow] = await queryRunner<{
      MINUTES: string | number | null
    }>(completionQuery.query, completionQuery.values)
    const minutesFromCompletions = Number(completionRow?.MINUTES ?? 0)

    return hoursFromProgress * 3600 + minutesFromCompletions * 60
  }

  private async calculateModuleCompletedUnits(
    moduleId: number,
    period?: number
  ): Promise<number> {
    const params: Record<string, unknown> = { moduleId }
    const completionConditions = [
      `gtc."STATE" = 'A'`,
      `COALESCE(gtc."MODULE_ID", gm."MODULE_ID") = :moduleId`,
    ]

    if (Number.isInteger(period)) {
      completionConditions.push('gtc."PERIOD" = :period')
      params.period = period
    }

    const completionSubQuery = `
      SELECT
        gtc."GOAL_TASK_ID",
        SUM(gtc."UNITS") AS "UNITS"
      FROM public."GOAL_TASK_COMPLETION" gtc
      LEFT JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gtc."GOAL_MODULE_ID"
      WHERE ${completionConditions.join(' AND ')}
      GROUP BY gtc."GOAL_TASK_ID"
    `

    const goalConditions = [`gm."MODULE_ID" = :moduleId`, `gm."STATE" = 'A'`]
    if (Number.isInteger(period)) {
      goalConditions.push('gm."PERIOD" = :period')
    }

    const sql = `
      SELECT
        gt."GOAL_MODULE_ID",
        MIN(
          COALESCE(tc."UNITS", 0) /
          NULLIF(COALESCE(gt."UNITS_PER_ITEM", 1), 0)
        ) AS "GARMENTS"
      FROM public."GOAL_TASK" gt
      INNER JOIN public."GOAL_X_MODULE" gm
        ON gm."GOAL_MODULE_ID" = gt."GOAL_MODULE_ID"
      LEFT JOIN (${completionSubQuery}) tc
        ON tc."GOAL_TASK_ID" = gt."GOAL_TASK_ID"
      WHERE ${goalConditions.join(' AND ')}
      GROUP BY gt."GOAL_MODULE_ID"
    `

    const query = preparePostgresQuery(sql, params)
    const rows = await queryRunner<{ GARMENTS: string | number | null }>(
      query.query,
      query.values
    )

    const totalUnits = rows.reduce((acc, row) => {
      const garments = Number(row?.GARMENTS ?? 0)
      if (Number.isFinite(garments)) {
        return acc + Math.max(garments, 0)
      }
      return acc
    }, 0)

    return Number(totalUnits.toFixed(2))
  }
}
