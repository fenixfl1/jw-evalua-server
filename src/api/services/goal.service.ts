import { In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Goal } from '@src/entity/Goal'
import { GoalScope } from '@src/entity/goal-scope.enum'
import { GoalStaff } from '@src/entity/GoalStaff'
import { GoalModule } from '@src/entity/GoalModule'
import { GoalProgress } from '@src/entity/GoalProgress'
import { Module } from '@src/entity/Module'
import { Staff } from '@src/entity/Staff'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { paginatedQuery } from '@src/helpers/query-utils'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { NotFoundError } from '@src/errors/http.error'

interface CreateGoalPayload extends Goal {}

interface AssignToStaffPayload {
  GOAL_ID: number
  PERIOD: number // ISO week id (YYYYWW)
  ASSIGNMENTS: { STAFF_ID: number; TARGET_VALUE: number; WEIGHT?: number }[]
}

interface AssignToModulePayload {
  GOAL_ID: number
  MODULE_ID: number
  PERIOD: number
  TARGET_VALUE: number
}

interface PostProgressPayload {
  GOAL_ID: number
  SCOPE: GoalScope
  PERIOD: number
  ACTUAL_VALUE: number
  STAFF_ID?: number
  MODULE_ID?: number
}

interface StaffSummaryPayload {
  STAFF_ID: number
  PERIOD: number
}

interface ModuleSummaryPayload {
  MODULE_ID: number
  PERIOD: number
}

export class GoalService extends BaseService {
  private goalRepository: Repository<Goal>
  private goalStaffRepository: Repository<GoalStaff>
  private goalModuleRepository: Repository<GoalModule>
  private goalProgressRepository: Repository<GoalProgress>
  private moduleRepository: Repository<Module>
  private staffRepositoryLocal: Repository<Staff>

  constructor() {
    super()
    this.goalRepository = this.dataSource.getRepository(Goal)
    this.goalStaffRepository = this.dataSource.getRepository(GoalStaff)
    this.goalModuleRepository = this.dataSource.getRepository(GoalModule)
    this.goalProgressRepository = this.dataSource.getRepository(GoalProgress)
    this.moduleRepository = this.dataSource.getRepository(Module)
    this.staffRepositoryLocal = this.dataSource.getRepository(Staff)
  }

  @CatchServiceError()
  async create(
    payload: CreateGoalPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const goal = this.goalRepository.create({
      ...payload,
      CREATED_AT: new Date(),
      CREATED_BY: session.userId,
      STATE: 'A',
    })

    await this.goalRepository.save(goal)
    return this.success({ message: 'Meta creada con éxito.', data: goal })
  }

  @CatchServiceError()
  async assignToStaff(
    payload: AssignToStaffPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { GOAL_ID, PERIOD, ASSIGNMENTS } = payload
    const goal = await this.goalRepository.findOne({ where: { GOAL_ID } })
    if (!goal) throw new NotFoundError('Meta no encontrada.')

    const data: GoalStaff[] = []
    for (const item of ASSIGNMENTS) {
      const { STAFF_ID, TARGET_VALUE, WEIGHT } = item
      const base = this.goalStaffRepository.create({
        GOAL_ID,
        STAFF_ID,
        PERIOD,
        TARGET_VALUE,
        WEIGHT: (WEIGHT ?? goal.WEIGHT) as never,
        CREATED_AT: new Date(),
        CREATED_BY: session.userId,
        STATE: 'A',
      })
      data.push(base)
    }

    await this.goalStaffRepository.save(data)
    return this.success({ message: 'Asignaciones a empleados registradas.' })
  }

  @CatchServiceError()
  async assignToModule(
    payload: AssignToModulePayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { GOAL_ID, MODULE_ID, PERIOD, TARGET_VALUE } = payload
    const goal = await this.goalRepository.findOne({ where: { GOAL_ID } })
    if (!goal) throw new NotFoundError('Meta no encontrada.')

    const module = await this.moduleRepository.findOne({ where: { MODULE_ID } })
    if (!module) throw new NotFoundError('Módulo no encontrado.')

    const record = this.goalModuleRepository.create({
      GOAL_ID,
      MODULE_ID,
      PERIOD,
      TARGET_VALUE,
      CREATED_AT: new Date(),
      CREATED_BY: session.userId,
      STATE: 'A',
    })

    await this.goalModuleRepository.save(record)
    return this.success({ message: 'Meta asignada al módulo con éxito.' })
  }

  @CatchServiceError()
  async postProgress(
    payload: PostProgressPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { GOAL_ID, SCOPE, PERIOD, ACTUAL_VALUE, STAFF_ID, MODULE_ID } =
      payload

    const goal = await this.goalRepository.findOne({ where: { GOAL_ID } })
    if (!goal) throw new NotFoundError('Meta no encontrada.')

    if (SCOPE === GoalScope.INDIVIDUAL) {
      if (!STAFF_ID)
        throw new NotFoundError(
          'STAFF_ID es requerido para metas individuales.'
        )
      const staff = await this.staffRepositoryLocal.findOne({
        where: { STAFF_ID },
      })
      if (!staff) throw new NotFoundError('Empleado no encontrado.')
    } else {
      if (!MODULE_ID)
        throw new NotFoundError('MODULE_ID es requerido para metas de módulo.')
      const module = await this.moduleRepository.findOne({
        where: { MODULE_ID },
      })
      if (!module) throw new NotFoundError('Módulo no encontrado.')
    }

    const progress = this.goalProgressRepository.create({
      GOAL_ID,
      SCOPE,
      PERIOD,
      ACTUAL_VALUE,
      STAFF_ID: SCOPE === GoalScope.INDIVIDUAL ? (STAFF_ID as number) : null,
      MODULE_ID: SCOPE === GoalScope.MODULE ? (MODULE_ID as number) : null,
      CREATED_AT: new Date(),
      CREATED_BY: session.userId,
      STATE: 'A',
    })

    await this.goalProgressRepository.save(progress)
    return this.success({ message: 'Progreso registrado con éxito.' })
  }

  @CatchServiceError()
  async getStaffSummary(
    payload: StaffSummaryPayload,
    _session: SessionInfo
  ): Promise<ApiResponse> {
    const { STAFF_ID, PERIOD } = payload

    // Obtener asignaciones del empleado
    const assignments = await this.goalStaffRepository.find({
      where: { STAFF_ID, PERIOD, STATE: 'A' as never },
    })

    if (!assignments.length) {
      return this.noContent()
    }

    const goalIds = assignments.map((a) => a.GOAL_ID)
    const goals = await this.goalRepository.findBy({
      GOAL_ID: In(goalIds) as never,
    })

    const progress = await this.goalProgressRepository.find({
      where: {
        SCOPE: 'individual' as never,
        STAFF_ID,
        PERIOD,
        STATE: 'A' as never,
      },
    })

    const byGoal: Record<
      number,
      { target: number; weight: number; actual: number }
    > = {}
    for (const a of assignments) {
      const g = goals.find((x) => x.GOAL_ID === a.GOAL_ID)
      const weight = (a.WEIGHT ?? g?.WEIGHT ?? 0) as unknown as number
      byGoal[a.GOAL_ID] = {
        target: Number(a.TARGET_VALUE || 0),
        weight,
        actual: 0,
      }
    }
    for (const p of progress) {
      if (!byGoal[p.GOAL_ID]) continue
      byGoal[p.GOAL_ID].actual += Number(p.ACTUAL_VALUE || 0)
    }

    const details = Object.entries(byGoal).map(([goalId, v]) => {
      const compliance = v.target > 0 ? (v.actual / v.target) * v.weight : 0
      return {
        GOAL_ID: Number(goalId),
        TARGET_VALUE: v.target,
        ACTUAL_VALUE: v.actual,
        WEIGHT: v.weight,
        COMPLIANCE: compliance, // puede superar 100 para empleados
      }
    })

    const totalCompliance = details.reduce((acc, d) => acc + d.COMPLIANCE, 0)

    return this.success({
      data: {
        STAFF_ID,
        PERIOD,
        TOTAL_COMPLIANCE: totalCompliance,
        DETAILS: details,
      },
    })
  }

  @CatchServiceError()
  async getModuleSummary(
    payload: ModuleSummaryPayload,
    _session: SessionInfo
  ): Promise<ApiResponse> {
    const { MODULE_ID, PERIOD } = payload

    // Metas de módulo (scope = 'module')
    const goals = await this.goalRepository.find({
      where: { SCOPE: 'module' as never },
    })
    if (!goals.length) return this.noContent()

    const goalIds = goals.map((g) => g.GOAL_ID)
    const assignments = await this.goalModuleRepository.find({
      where: { MODULE_ID, PERIOD, STATE: 'A' as never },
    })

    const progress = await this.goalProgressRepository.find({
      where: {
        SCOPE: 'module' as never,
        MODULE_ID,
        PERIOD,
        STATE: 'A' as never,
      },
    })

    const byGoal: Record<
      number,
      { target: number; weight: number; actual: number }
    > = {}
    for (const g of goals) {
      byGoal[g.GOAL_ID] = {
        target: 0,
        weight: (g.WEIGHT as unknown as number) || 0,
        actual: 0,
      }
    }
    for (const a of assignments) {
      if (!byGoal[a.GOAL_ID]) continue
      byGoal[a.GOAL_ID].target += Number(a.TARGET_VALUE || 0)
    }
    for (const p of progress) {
      if (!byGoal[p.GOAL_ID]) continue
      byGoal[p.GOAL_ID].actual += Number(p.ACTUAL_VALUE || 0)
    }

    const details = Object.entries(byGoal)
      .filter(([goalId]) => goalIds.includes(Number(goalId)))
      .map(([goalId, v]) => {
        const raw = v.target > 0 ? v.actual / v.target : 0
        const capped = Math.min(raw, 1) // módulo cap 100% por meta
        const compliance = capped * v.weight
        const lastUpdate = progress
          .filter((p) => p.GOAL_ID === Number(goalId))
          .reduce((acc: Date | null, cur) => {
            const d = (cur.UPDATED_AT || cur.CREATED_AT) as unknown as Date
            return !acc || (d && d > acc) ? d : acc
          }, null)
        return {
          GOAL_ID: Number(goalId),
          TARGET_VALUE: v.target,
          ACTUAL_VALUE: v.actual,
          WEIGHT: v.weight,
          COMPLIANCE: compliance,
          UPDATED_AT: lastUpdate || null,
        }
      })

    const sum = details.reduce((acc, d) => acc + d.COMPLIANCE, 0)
    const TOTAL_COMPLIANCE = Math.min(sum, 100) // cap total en 100% para módulo

    return this.success({
      data: { MODULE_ID, PERIOD, TOTAL_COMPLIANCE, DETAILS: details },
    })
  }

  @CatchServiceError()
  async getGoalsByModule(moduleId: number): Promise<ApiResponse> {
    const goals = await this.goalRepository.find({
      where: { SCOPE: 'module' as never },
      order: { GOAL_ID: 'DESC' as never },
    })

    if (!goals.length) return this.noContent()

    return this.success({ data: goals })
  }

  @CatchServiceError()
  async getModuleSummaryPagination(
    conditions: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { whereClause, values } = whereClauseBuilder(conditions)

    const statement = `
      WITH GM AS (
        SELECT
          "GOAL_ID",
          "MODULE_ID",
          "PERIOD",
          SUM("TARGET_VALUE") AS "TARGET_VALUE"
        FROM public."GOAL_X_MODULE"
        WHERE "STATE" = 'A'
        GROUP BY "GOAL_ID", "MODULE_ID", "PERIOD"
      ),
      GP AS (
        SELECT
          "GOAL_ID",
          "MODULE_ID",
          "PERIOD",
          SUM("ACTUAL_VALUE") AS "ACTUAL_VALUE",
          MAX(COALESCE("UPDATED_AT", "CREATED_AT")) AS "LAST_UPDATE"
        FROM public."GOAL_PROGRESS"
        WHERE "SCOPE" = 'module' AND "STATE" = 'A'
        GROUP BY "GOAL_ID", "MODULE_ID", "PERIOD"
      ),
      DATA AS (
        SELECT
          COALESCE(gm."GOAL_ID", gp."GOAL_ID") AS "GOAL_ID",
          COALESCE(gm."MODULE_ID", gp."MODULE_ID") AS "MODULE_ID",
          COALESCE(gp."PERIOD", gm."PERIOD") AS "PERIOD",
          gm."TARGET_VALUE",
          gp."ACTUAL_VALUE",
          gp."LAST_UPDATE"
        FROM GM gm
        FULL OUTER JOIN GP gp
          ON gm."GOAL_ID" = gp."GOAL_ID"
        AND gm."MODULE_ID" IS NOT DISTINCT FROM gp."MODULE_ID"
        AND (
          gm."PERIOD" IS NULL
          OR gp."PERIOD" IS NULL
          OR gm."PERIOD" = gp."PERIOD"
        )
      )
      SELECT
        *
      FROM (
        SELECT
          g."GOAL_ID",
          g."DESCRIPTION",
          g."WEIGHT",
          g."STATE",
          d."MODULE_ID",
          d."PERIOD",
          COALESCE(d."TARGET_VALUE", 0) AS "TARGET_VALUE",
          COALESCE(d."ACTUAL_VALUE", 0) AS "ACTUAL_VALUE",
          CASE
            WHEN d."TARGET_VALUE" IS NULL THEN NULL
            WHEN d."TARGET_VALUE" > 0 THEN ROUND(
              LEAST(COALESCE(d."ACTUAL_VALUE", 0)::decimal / d."TARGET_VALUE", 1) * g."WEIGHT",
              2
            )
            ELSE 0
          END AS "COMPLIANCE",
          d."LAST_UPDATE" AS "UPDATED_AT",
          g."DESCRIPTION" || ' ' || g."GOAL_ID" AS "FILTER"
        FROM public."GOAL" g
        LEFT JOIN DATA d ON d."GOAL_ID" = g."GOAL_ID"
        WHERE g."SCOPE" = 'module'
      ) AS SUBQUERY
      ${whereClause}
      ORDER BY "GOAL_ID" DESC, "MODULE_ID" DESC NULLS LAST, "PERIOD" DESC NULLS LAST
    `

    const [data = [], metadata] = await paginatedQuery({
      statement,
      values,
      pagination,
    })

    if (!data.length) {
      return this.noContent()
    }

    return this.success({ data, metadata })
  }
}
