import moment from 'moment'
import { Between, In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { GoalTaskStaff } from '@src/entity/GoalTaskStaff'
import { GoalTaskCompletion } from '@src/entity/GoalTaskCompletion'
import { GoalProgress } from '@src/entity/GoalProgress'
import { GoalScope } from '@src/entity/goal-scope.enum'
import { ApiResponse, SessionInfo } from '@src/types/api.types'
import { BadRequestError, NotFoundError } from '@src/errors/http.error'
import { GoalTaskSession } from '@src/entity/GoalTaskSession'
import { emitProgressUpdate } from '@src/realtime/socket'

interface DashboardParams {
  date?: string
  period?: number
}

interface RegisterCompletionPayload {
  timestamp?: string
  units?: number
  metadata?: Record<string, unknown>
  staffIdOverride?: number
}

interface ResetTaskPayload {
  date?: string
}

interface StartSessionPayload {
  timestamp?: string
  staffIdOverride?: number
}

interface SessionActionPayload {
  timestamp?: string
  staffIdOverride?: number
}

type OperatorTaskDto = {
  id: number
  name: string
  description: string | null
  unitLabel: string
  goalPerHour: number | null
  color: string
  target: number
  goalId: number
  goalModuleId: number | null
  moduleId: number | null
  period: number | null
}

type OperatorHistoryEntry = {
  id: number
  taskId: number
  timestamp: string
  units: number
}

type DashboardResponse = {
  date: string
  period: number
  tasks: OperatorTaskDto[]
  totals: Record<string, number>
  history: OperatorHistoryEntry[]
}

type CompletionResponse = {
  completion: OperatorHistoryEntry
  totalForTask: number
}

type ResetResponse = {
  taskId: number
  totalForTask: number
  removedEntryIds: number[]
}

type SessionResponse = {
  sessionId: number
  startedAt: string
  endedAt?: string | null
  accumulatedSeconds: number
  isActive: boolean
}

const MAX_HISTORY = 40
const DEFAULT_UNIT_LABEL = 'unidad'
const COLOR_PALETTE = [
  '#ff4d4f',
  '#faad14',
  '#13c2c2',
  '#722ed1',
  '#52c41a',
  '#2f54eb',
  '#eb2f96',
]

export class OperatorService extends BaseService {
  private goalTaskStaffRepository: Repository<GoalTaskStaff>
  private goalTaskCompletionRepository: Repository<GoalTaskCompletion>
  private goalProgressRepository: Repository<GoalProgress>
  private goalTaskSessionRepository: Repository<GoalTaskSession>

  constructor() {
    super()
    this.goalTaskStaffRepository = this.dataSource.getRepository(GoalTaskStaff)
    this.goalTaskCompletionRepository =
      this.dataSource.getRepository(GoalTaskCompletion)
    this.goalProgressRepository = this.dataSource.getRepository(GoalProgress)
    this.goalTaskSessionRepository =
      this.dataSource.getRepository(GoalTaskSession)
  }

  @CatchServiceError()
  async getDashboard(
    params: DashboardParams,
    session: SessionInfo
  ): Promise<ApiResponse<DashboardResponse>> {
    const { staffId } = await this.getStaffContext(session)
    const { start, end, momentDate } = this.getDateRange(params.date)

    const targetPeriod =
      typeof params.period === 'number'
        ? params.period
        : this.getIsoWeekId(momentDate.toDate())

    const assignments = await this.goalTaskStaffRepository.find({
      where: { STAFF_ID: staffId, STATE: 'A' as never },
      relations: ['TASK', 'TASK.GOAL_MODULE'],
      order: { GOAL_TASK_STAFF_ID: 'ASC' },
    })

    const tasks = assignments
      .filter((assignment) => {
        const modulePeriod = assignment.TASK?.GOAL_MODULE?.PERIOD
        if (!assignment.TASK) return false
        if (modulePeriod && typeof params.period === 'number') {
          return modulePeriod === params.period
        }
        if (modulePeriod) {
          return modulePeriod === targetPeriod
        }
        return true
      })
      .map((assignment) => this.mapTaskDto(assignment))

    const totalsRaw = await this.goalTaskCompletionRepository
      .createQueryBuilder('completion')
      .select('completion."GOAL_TASK_ID"', 'taskId')
      .addSelect('COALESCE(SUM(completion."UNITS"), 0)', 'total')
      .where('completion."STAFF_ID" = :staffId', { staffId })
      .andWhere('completion."RECORDED_AT" BETWEEN :start AND :end', {
        start,
        end,
      })
      .groupBy('completion."GOAL_TASK_ID"')
      .getRawMany()

    const totals = totalsRaw.reduce<Record<string, number>>((acc, row) => {
      acc[String(row.taskId)] = Number(row.total) ?? 0
      return acc
    }, {})

    const historyRecords = await this.goalTaskCompletionRepository.find({
      where: { STAFF_ID: staffId },
      order: { RECORDED_AT: 'DESC' },
      take: MAX_HISTORY,
    })

    const history = historyRecords.map((record) => this.mapHistoryEntry(record))

    return this.success({
      data: {
        date: start.toISOString(),
        period: targetPeriod,
        tasks,
        totals,
        history,
      },
    })
  }

  @CatchServiceError()
  async startSession(
    taskId: number,
    payload: StartSessionPayload,
    session: SessionInfo
  ): Promise<ApiResponse<SessionResponse>> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new BadRequestError('Identificador de tarea inválido.')
    }

    const staffContext = await this.getStaffContext(session)
    const targetStaffId =
      typeof payload.staffIdOverride === 'number'
        ? payload.staffIdOverride
        : staffContext.staffId

    const assignment = await this.goalTaskStaffRepository.findOne({
      where: {
        STAFF_ID: targetStaffId,
        GOAL_TASK_ID: taskId,
        STATE: 'A' as never,
      },
      relations: ['TASK', 'TASK.GOAL_MODULE'],
    })

    if (!assignment || !assignment.TASK) {
      throw new NotFoundError(
        'No se encontró una asignación activa para esta tarea.'
      )
    }

    // cierra cualquier sesión activa previa
    const openSessions = await this.goalTaskSessionRepository.find({
      where: {
        GOAL_TASK_ID: taskId,
        STAFF_ID: targetStaffId,
        IS_ACTIVE: true,
      },
    })

    if (openSessions.length) {
      for (const sess of openSessions) {
        const now = new Date()
        const elapsed =
          this.calculateElapsedSeconds(sess.LAST_RESUMED_AT ?? sess.STARTED_AT, now) +
          Number(sess.ACCUMULATED_SECONDS ?? 0)
        await this.goalTaskSessionRepository.update(
          { GOAL_TASK_SESSION_ID: sess.GOAL_TASK_SESSION_ID },
          {
            ENDED_AT: now,
            IS_ACTIVE: false,
            ACCUMULATED_SECONDS: elapsed,
          }
        )
      }
    }

    const startedAt = this.normalizeTimestamp(payload.timestamp) ?? new Date()

    const record = this.goalTaskSessionRepository.create({
      GOAL_TASK_ID: assignment.GOAL_TASK_ID,
      GOAL_MODULE_ID: assignment.TASK.GOAL_MODULE_ID,
      MODULE_ID: assignment.TASK.GOAL_MODULE?.MODULE_ID ?? null,
      PERIOD: assignment.TASK.GOAL_MODULE?.PERIOD ?? null,
      STAFF_ID: targetStaffId,
      STARTED_AT: startedAt,
      LAST_RESUMED_AT: startedAt,
      ACCUMULATED_SECONDS: 0,
      IS_ACTIVE: true,
      CREATED_BY: session.userId,
      STATE: 'A',
    })

    const saved = await this.goalTaskSessionRepository.save(record)

    return this.success({
      data: {
        sessionId: saved.GOAL_TASK_SESSION_ID,
        startedAt: saved.STARTED_AT.toISOString(),
        accumulatedSeconds: Number(saved.ACCUMULATED_SECONDS ?? 0),
        isActive: saved.IS_ACTIVE,
      },
      message: 'Sesión iniciada',
    })
  }

  @CatchServiceError()
  async pauseSession(
    taskId: number,
    payload: SessionActionPayload,
    session: SessionInfo
  ): Promise<ApiResponse<SessionResponse>> {
    return this.updateSessionState(taskId, payload, session, 'pause')
  }

  @CatchServiceError()
  async resumeSession(
    taskId: number,
    payload: SessionActionPayload,
    session: SessionInfo
  ): Promise<ApiResponse<SessionResponse>> {
    return this.updateSessionState(taskId, payload, session, 'resume')
  }

  @CatchServiceError()
  async stopSession(
    taskId: number,
    payload: SessionActionPayload,
    session: SessionInfo
  ): Promise<ApiResponse<SessionResponse>> {
    return this.updateSessionState(taskId, payload, session, 'stop')
  }

  @CatchServiceError()
  async registerCompletion(
    taskId: number,
    payload: RegisterCompletionPayload,
    session: SessionInfo
  ): Promise<ApiResponse<CompletionResponse>> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new BadRequestError('Identificador de tarea inválido.')
    }

    const staffContext = await this.getStaffContext(session)
    const targetStaffId =
      typeof payload.staffIdOverride === 'number'
        ? payload.staffIdOverride
        : staffContext.staffId

    const assignment = await this.goalTaskStaffRepository.findOne({
      where: {
        STAFF_ID: targetStaffId,
        GOAL_TASK_ID: taskId,
        STATE: 'A' as never,
      },
      relations: ['TASK', 'TASK.GOAL_MODULE'],
    })

    if (!assignment || !assignment.TASK) {
      throw new NotFoundError(
        'No se encontró una asignación activa para esta tarea.'
      )
    }

    const units = this.normalizeUnits(payload.units)
    const recordedAt = this.normalizeTimestamp(payload.timestamp)
    const metadata = this.normalizeMetadata(payload.metadata)

    const { completion } = await this.dataSource.transaction<{
      completion: GoalTaskCompletion
    }>(async (manager) => {
      const now = new Date()
      const progressRepo = manager.getRepository(GoalProgress)
      const completionRepo = manager.getRepository(GoalTaskCompletion)

      const progress = progressRepo.create({
        GOAL_ID: assignment.TASK.GOAL_ID,
        MODULE_ID: assignment.TASK.GOAL_MODULE?.MODULE_ID ?? null,
        GOAL_MODULE_ID: assignment.TASK.GOAL_MODULE_ID,
        SCOPE: GoalScope.INDIVIDUAL,
        PERIOD:
          assignment.TASK.GOAL_MODULE?.PERIOD ??
          this.getIsoWeekId(recordedAt ?? now),
        STAFF_ID: targetStaffId,
        ACTUAL_VALUE: units,
        ACTUAL_TIME: null,
        CREATED_AT: now,
        CREATED_BY: session.userId,
        STATE: 'A',
      } as GoalProgress)

      const savedProgress = await progressRepo.save(progress)

      const completionRecord = completionRepo.create({
        GOAL_TASK_ID: assignment.GOAL_TASK_ID,
        GOAL_TASK_STAFF_ID: assignment.GOAL_TASK_STAFF_ID,
        GOAL_PROGRESS_ID: savedProgress.GOAL_PROGRESS_ID,
        GOAL_ID: assignment.TASK.GOAL_ID,
        GOAL_MODULE_ID: assignment.TASK.GOAL_MODULE_ID,
        MODULE_ID: assignment.TASK.GOAL_MODULE?.MODULE_ID ?? null,
        PERIOD: assignment.TASK.GOAL_MODULE?.PERIOD ?? null,
        STAFF_ID: targetStaffId,
        UNITS: units,
        RECORDED_AT: recordedAt ?? now,
        METADATA: metadata,
        CREATED_AT: now,
        CREATED_BY: session.userId,
        STATE: 'A',
      } as GoalTaskCompletion)

      const savedCompletion = await completionRepo.save(completionRecord)

      return { completion: savedCompletion }
    })

    const dayRange = this.getDateRange(
      (completion.RECORDED_AT ?? new Date()).toISOString()
    )

    const totalsRaw = await this.goalTaskCompletionRepository
      .createQueryBuilder('completion')
      .select('COALESCE(SUM(completion."UNITS"), 0)', 'total')
      .where('completion."STAFF_ID" = :staffId', {
        staffId: staffContext.staffId,
      })
      .andWhere('completion."GOAL_TASK_ID" = :taskId', { taskId })
      .andWhere('completion."RECORDED_AT" BETWEEN :start AND :end', {
        start: dayRange.start,
        end: dayRange.end,
      })
      .getRawOne()

    const totalForTask = Number(totalsRaw?.total ?? 0)

    emitProgressUpdate({
      type: 'completion',
      taskId: assignment.TASK.GOAL_TASK_ID,
      goalId: assignment.TASK.GOAL_ID,
      goalModuleId: assignment.TASK.GOAL_MODULE_ID ?? null,
      moduleId: assignment.TASK.GOAL_MODULE?.MODULE_ID ?? null,
      period: assignment.TASK.GOAL_MODULE?.PERIOD ?? null,
      totalForTask,
      timestamp: completion.RECORDED_AT?.toISOString() ?? new Date().toISOString(),
    })

    return this.success({
      message: 'Progreso registrado con éxito.',
      data: {
        completion: this.mapHistoryEntry(completion),
        totalForTask,
      },
    })
  }

  @CatchServiceError()
  async resetTask(
    taskId: number,
    payload: ResetTaskPayload,
    session: SessionInfo
  ): Promise<ApiResponse<ResetResponse>> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new BadRequestError('Identificador de tarea inválido.')
    }

    const { staffId } = await this.getStaffContext(session)
    const { start, end } = this.getDateRange(payload.date)

    const assignment = await this.goalTaskStaffRepository.findOne({
      where: {
        STAFF_ID: staffId,
        GOAL_TASK_ID: taskId,
        STATE: 'A' as never,
      },
      relations: ['TASK', 'TASK.GOAL_MODULE'],
    })

    const records = await this.goalTaskCompletionRepository.find({
      where: {
        STAFF_ID: staffId,
        GOAL_TASK_ID: taskId,
        RECORDED_AT: Between(start, end),
      },
      select: [
        'GOAL_TASK_COMPLETION_ID',
        'GOAL_PROGRESS_ID',
        'GOAL_TASK_ID',
        'RECORDED_AT',
      ],
      order: { RECORDED_AT: 'DESC' },
    })

    if (records.length === 0) {
      return this.success({
        message: 'No se encontraron registros para limpiar.',
        data: {
          taskId,
          totalForTask: 0,
          removedEntryIds: [],
        },
      })
    }

    await this.dataSource.transaction(async (manager) => {
      const progressIds = records
        .map((record) => record.GOAL_PROGRESS_ID)
        .filter((id): id is number => typeof id === 'number')

      if (progressIds.length) {
        await manager.getRepository(GoalProgress).delete(progressIds)
      }

      await manager
        .getRepository(GoalTaskCompletion)
        .delete(records.map((record) => record.GOAL_TASK_COMPLETION_ID))
    })

    emitProgressUpdate({
      type: 'reset',
      taskId,
      goalId: assignment?.TASK?.GOAL_ID ?? 0,
      goalModuleId: assignment?.TASK?.GOAL_MODULE_ID ?? null,
      moduleId: assignment?.TASK?.GOAL_MODULE?.MODULE_ID ?? null,
      period: assignment?.TASK?.GOAL_MODULE?.PERIOD ?? null,
      totalForTask: 0,
      timestamp: new Date().toISOString(),
    })

    return this.success({
      message: 'Conteo reiniciado con éxito.',
      data: {
        taskId,
        totalForTask: 0,
        removedEntryIds: records.map(
          (record) => record.GOAL_TASK_COMPLETION_ID
        ),
      },
    })
  }

  private mapTaskDto(assignment: GoalTaskStaff): OperatorTaskDto {
    const task = assignment.TASK
    const module = task?.GOAL_MODULE

    return {
      id: assignment.GOAL_TASK_ID,
      name: task?.DESCRIPTION ?? 'Tarea sin nombre',
      description: task?.COMMENT ?? null,
      unitLabel: DEFAULT_UNIT_LABEL,
      goalPerHour:
        typeof assignment.TARGET === 'number' ? assignment.TARGET : null,
      color: this.getTaskColor(assignment.GOAL_TASK_ID),
      target: assignment.TARGET ?? 0,
      goalId: task?.GOAL_ID ?? 0,
      goalModuleId: task?.GOAL_MODULE_ID ?? null,
      moduleId: module?.MODULE_ID ?? null,
      period: module?.PERIOD ?? null,
    }
  }

  private mapHistoryEntry(entry: GoalTaskCompletion): OperatorHistoryEntry {
    return {
      id: entry.GOAL_TASK_COMPLETION_ID,
      taskId: entry.GOAL_TASK_ID,
      timestamp: (
        entry.RECORDED_AT ??
        entry.CREATED_AT ??
        new Date()
      ).toISOString(),
      units: entry.UNITS ?? 0,
    }
  }

  private getTaskColor(taskId: number): string {
    const index = Math.abs(taskId) % COLOR_PALETTE.length
    return COLOR_PALETTE[index]
  }

  private getDateRange(date?: string) {
    const parsed = date ? moment(date) : moment()
    if (!parsed.isValid()) {
      throw new BadRequestError('Fecha inválida.')
    }

    return {
      start: parsed.clone().startOf('day').toDate(),
      end: parsed.clone().endOf('day').toDate(),
      momentDate: parsed,
    }
  }

  private calculateElapsedSeconds(start: Date, end: Date): number {
    return Math.max(0, (end.getTime() - start.getTime()) / 1000)
  }

  private async updateSessionState(
    taskId: number,
    payload: SessionActionPayload,
    session: SessionInfo,
    action: 'pause' | 'resume' | 'stop'
  ): Promise<ApiResponse<SessionResponse>> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new BadRequestError('Identificador de tarea inválido.')
    }

    const staffContext = await this.getStaffContext(session)
    const targetStaffId =
      typeof payload.staffIdOverride === 'number'
        ? payload.staffIdOverride
        : staffContext.staffId

    const whereClause =
      action === 'resume'
        ? {
            GOAL_TASK_ID: taskId,
            STAFF_ID: targetStaffId,
          }
        : {
            GOAL_TASK_ID: taskId,
            STAFF_ID: targetStaffId,
            IS_ACTIVE: true,
          }

    const activeSession = await this.goalTaskSessionRepository.findOne({
      where: whereClause as never,
      order: { STARTED_AT: 'DESC' as never },
    })

    if (!activeSession) {
      throw new NotFoundError(
        action === 'resume'
          ? 'No hay una sesión previa para reanudar.'
          : 'No hay una sesión activa para esta tarea.'
      )
    }

    if ((action === 'pause' || action === 'stop') && !activeSession.IS_ACTIVE) {
      throw new BadRequestError('No hay una sesión activa para esta tarea.')
    }

    const now = this.normalizeTimestamp(payload.timestamp) ?? new Date()
    let accumulated = Number(activeSession.ACCUMULATED_SECONDS ?? 0)

    if (action === 'pause' || action === 'stop') {
      accumulated += this.calculateElapsedSeconds(
        activeSession.LAST_RESUMED_AT ?? activeSession.STARTED_AT,
        now
      )
    } else if (action === 'resume') {
      // no changes to accumulated, just update resume tracker
    }

    let isActive = activeSession.IS_ACTIVE
    let endedAt: Date | null = activeSession.ENDED_AT
    let lastResumedAt: Date | null = activeSession.LAST_RESUMED_AT

    if (action === 'pause') {
      isActive = false
      endedAt = now
    } else if (action === 'resume') {
      isActive = true
      lastResumedAt = now
      endedAt = null
    } else if (action === 'stop') {
      isActive = false
      endedAt = now
    }

    await this.goalTaskSessionRepository.update(
      { GOAL_TASK_SESSION_ID: activeSession.GOAL_TASK_SESSION_ID },
      {
        ACCUMULATED_SECONDS: accumulated,
        LAST_RESUMED_AT: lastResumedAt,
        ENDED_AT: endedAt,
        IS_ACTIVE: isActive,
      }
    )

    return this.success({
      data: {
        sessionId: activeSession.GOAL_TASK_SESSION_ID,
        startedAt: activeSession.STARTED_AT.toISOString(),
        endedAt: endedAt ? endedAt.toISOString() : null,
        accumulatedSeconds: accumulated,
        isActive,
      },
      message:
        action === 'pause'
          ? 'Sesión pausada'
          : action === 'resume'
          ? 'Sesión reanudada'
          : 'Sesión finalizada',
    })
  }

  private normalizeUnits(units?: number): number {
    if (units === undefined || units === null) {
      return 1
    }
    if (!Number.isInteger(units) || units <= 0) {
      throw new BadRequestError(
        'Las unidades deben ser un número entero mayor a cero.'
      )
    }
    return units
  }

  private normalizeTimestamp(timestamp?: string): Date | null {
    if (!timestamp) {
      return null
    }
    const parsed = moment(timestamp)
    if (!parsed.isValid()) {
      throw new BadRequestError('Marca de tiempo inválida.')
    }
    return parsed.toDate()
  }

  private normalizeMetadata(
    metadata?: Record<string, unknown>
  ): Record<string, unknown> | null {
    if (!metadata || typeof metadata !== 'object') {
      return null
    }
    return metadata
  }

  private async getStaffContext(session: SessionInfo) {
    const user = await this.userRepository.findOne({
      where: { USER_ID: session.userId },
    })

    if (!user || !user.STAFF_ID) {
      throw new NotFoundError('No se pudo determinar el operador actual.')
    }

    return { staffId: user.STAFF_ID }
  }

  private getIsoWeekId(date: Date): number {
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    )

    const day = utcDate.getUTCDay() || 7

    if (day !== 7) {
      utcDate.setUTCDate(utcDate.getUTCDate() + (4 - day))
    }

    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(
      ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )

    return utcDate.getUTCFullYear() * 100 + weekNo
  }
}
