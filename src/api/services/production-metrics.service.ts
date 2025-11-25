import { Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { ModuleEfficiency } from '@src/entity/ModuleEfficiency'
import { ProcessAudit } from '@src/entity/ProcessAudit'
import { GoalTaskSession } from '@src/entity/GoalTaskSession'
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

  constructor() {
    super()
    this.efficiencyRepository = this.dataSource.getRepository(ModuleEfficiency)
    this.processAuditRepository = this.dataSource.getRepository(ProcessAudit)
    this.goalTaskSessionRepository =
      this.dataSource.getRepository(GoalTaskSession)
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
  async getEfficiency(moduleId: number, period?: number): Promise<ApiResponse> {
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const where: Record<string, unknown> = {
      MODULE_ID: moduleId,
      STATE: 'A',
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

    const auditDate = new Date(payload.AUDIT_DATE)
    if (Number.isNaN(auditDate.getTime())) {
      throw new BadRequestError('AUDIT_DATE inválido.')
    }

    const entries = Array.isArray(payload.ENTRIES)
      ? payload.ENTRIES.map((entry) => ({
          operation: entry.operation?.trim() || null,
          operator: entry.operator?.trim() || null,
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
      STYLE: payload.STYLE?.trim() || null,
      SUPERVISOR: payload.SUPERVISOR?.trim() || null,
      AUDITOR: payload.AUDITOR?.trim() || null,
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
    moduleId: number,
    filters: { startDate?: string; endDate?: string }
  ): Promise<ApiResponse> {
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const qb = this.processAuditRepository
      .createQueryBuilder('audit')
      .where('audit."MODULE_ID" = :moduleId', { moduleId })
      .andWhere('audit."STATE" = :state', { state: 'A' })

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

    return this.success({ data })
  }

  @CatchServiceError()
  async getModuleWorkedMinutes(moduleId: number, period?: number) {
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      throw new BadRequestError('MODULE_ID inválido.')
    }

    const { minutesWorked, secondsWorked, activeSessions } =
      await this.calculateModuleWorkedTime(moduleId, period)

    return this.success({
      data: { minutesWorked, secondsWorked, activeSessions },
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
}
