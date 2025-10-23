import { EntityManager, In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Goal } from '@src/entity/Goal'
import { GoalScope } from '@src/entity/goal-scope.enum'
import { GoalStaff } from '@src/entity/GoalStaff'
import { GoalModule } from '@src/entity/GoalModule'
import { GoalProgress } from '@src/entity/GoalProgress'
import { Module } from '@src/entity/Module'
import { Staff } from '@src/entity/Staff'
import { StaffModule } from '@src/entity/StaffXModule'
import { GoalDailyTarget } from '@src/entity/GoalDailyTarget'
import { publishEmailToQueue } from './email/email-producer.service'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { paginatedQuery } from '@src/helpers/query-utils'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { BadRequestError, NotFoundError } from '@src/errors/http.error'

interface GoalDailyTargetPayload {
  TARGET_DATE: string | Date
  TARGET_VALUE: number
  TARGET_TIME?: number | null
}

interface CreateGoalPayload extends Omit<Goal, 'DAILY_TARGETS'> {
  DAILY_TARGETS?: GoalDailyTargetPayload[]
}

interface AssignToStaffPayload {
  GOAL_ID: number
  PERIOD: number
  ASSIGNMENTS: { STAFF_ID: number; TARGET_VALUE: number; WEIGHT?: number }[]
}

interface AssignToModulePayload {
  GOAL_ID: number
  MODULE_ID: number
  PERIOD: number
  TARGET_VALUE: number
  DAILY_TARGETS?: GoalDailyTargetPayload[]
}

interface ProgressContributionPayload {
  STAFF_ID: number
  ACTUAL_VALUE: number
  ACTUAL_TIME?: number | null
}

interface PostProgressPayload {
  GOAL_ID: number
  SCOPE: GoalScope
  PERIOD: number
  ACTUAL_VALUE: number
  ACTUAL_TIME?: number | null
  STAFF_ID?: number
  MODULE_ID?: number
  CONTRIBUTIONS?: ProgressContributionPayload[]
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
  private goalDailyTargetRepository: Repository<GoalDailyTarget>
  private moduleRepository: Repository<Module>
  private staffRepositoryLocal: Repository<Staff>
  private staffModuleRepository: Repository<StaffModule>

  constructor() {
    super()
    this.goalRepository = this.dataSource.getRepository(Goal)
    this.goalStaffRepository = this.dataSource.getRepository(GoalStaff)
    this.goalModuleRepository = this.dataSource.getRepository(GoalModule)
    this.goalProgressRepository = this.dataSource.getRepository(GoalProgress)
    this.goalDailyTargetRepository =
      this.dataSource.getRepository(GoalDailyTarget)
    this.moduleRepository = this.dataSource.getRepository(Module)
    this.staffRepositoryLocal = this.dataSource.getRepository(Staff)
    this.staffModuleRepository = this.dataSource.getRepository(StaffModule)
  }

  private getIsoWeekId(date: Date): number {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    const day = utcDate.getUTCDay() || 7
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day)
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
    const week = Math.ceil(
      ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )
    return utcDate.getUTCFullYear() * 100 + week
  }

  private toDateOnly(value: string | Date): Date {
    if (value instanceof Date) {
      return new Date(
        Date.UTC(
          value.getUTCFullYear(),
          value.getUTCMonth(),
          value.getUTCDate()
        )
      )
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.valueOf())) {
      throw new BadRequestError('Fecha de objetivo diario invalida.')
    }
    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate()
      )
    )
  }

  private async replaceDailyTargets(
    goalModuleId: number,
    targets: GoalDailyTargetPayload[],
    session: SessionInfo,
    manager?: EntityManager
  ): Promise<void> {
    try {
      if (!targets.length) return

      const dateEntries = targets.map((item) => {
        const normalizedDate = this.toDateOnly(item.TARGET_DATE)
        const period = this.getIsoWeekId(normalizedDate)
        const targetValue = Number(item.TARGET_VALUE ?? 0)
        const rawTargetTime =
          item.TARGET_TIME === undefined || item.TARGET_TIME === null
            ? null
            : Number(item.TARGET_TIME)
        const targetTime =
          rawTargetTime !== null && Number.isFinite(rawTargetTime)
            ? rawTargetTime
            : null
        return {
          period,
          targetDate: normalizedDate.toISOString().slice(0, 10),
          targetValue,
          targetTime,
        }
      })

      const periods = Array.from(
        new Set(dateEntries.map((item) => item.period))
      )
      const now = new Date()

      const repository = manager
        ? manager.getRepository(GoalDailyTarget)
        : this.goalDailyTargetRepository

      const updateBuilder = repository
        .createQueryBuilder()
        .update()
        .set({
          STATE: 'I',
          UPDATED_AT: now,
          UPDATED_BY: session.userId,
        })
        .where('GOAL_MODULE_ID = :goalModuleId', { goalModuleId })
        .andWhere('PERIOD IN (:...periods)', { periods })
      await updateBuilder.execute()

      const records = dateEntries.map(
        ({ period, targetDate, targetValue, targetTime }) =>
          repository.create({
            GOAL_MODULE_ID: goalModuleId,
            PERIOD: period,
            TARGET_DATE: targetDate,
            TARGET_VALUE: targetValue,
            TARGET_TIME: targetTime,
            CREATED_AT: now,
            CREATED_BY: session.userId,
            STATE: 'A',
          } as never)
      )

      await repository.save(records as never)
    } catch (error) {
      throw error
    }
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
    } as never)

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

    const module = await this.moduleRepository.findOne({
      where: { MODULE_ID },
      relations: ['SUPERVISOR', 'SUPERVISOR.STAFF'],
    })
    if (!module) throw new NotFoundError('Módulo no encontrado.')

    if (goal.SCOPE !== GoalScope.MODULE) {
      throw new BadRequestError(
        'La meta debe ser de alcance modulo para asignarse a un modulo.'
      )
    }

    if (!Number.isFinite(TARGET_VALUE)) {
      throw new BadRequestError('El objetivo debe ser un numero valido.')
    }

    if (TARGET_VALUE < 0) {
      throw new BadRequestError('El objetivo debe ser mayor o igual a cero.')
    }

    if (!Number.isInteger(TARGET_VALUE)) {
      throw new BadRequestError(
        'El objetivo debe ser un numero entero para distribuirse entre el personal.'
      )
    }

    const activeMembers = await this.getActiveModuleMembers(MODULE_ID)
    if (!activeMembers.length) {
      throw new BadRequestError(
        'El modulo seleccionado no tiene miembros activos para distribuir la meta.'
      )
    }

    const distributedTargets = this.distributeTarget(
      TARGET_VALUE,
      activeMembers.length
    )
    const staffTargets = activeMembers.map((staff, index) => ({
      staff,
      target: distributedTargets[index] ?? 0,
    }))
    const now = new Date()

    await this.dataSource.transaction(async (manager) => {
      const goalModuleRepo = manager.getRepository(GoalModule)
      const goalStaffRepo = manager.getRepository(GoalStaff)

      const record = goalModuleRepo.create({
        GOAL_ID,
        MODULE_ID,
        PERIOD,
        TARGET_VALUE,
        CREATED_AT: now,
        CREATED_BY: session.userId,
        STATE: 'A',
      })

      await goalModuleRepo.save(record)

      if (payload.DAILY_TARGETS?.length) {
        await this.replaceDailyTargets(
          record.GOAL_MODULE_ID,
          payload.DAILY_TARGETS,
          session,
          manager
        )
      }

      try {
        const staffAssignments = activeMembers.map((staff, index) =>
          goalStaffRepo.create({
            GOAL_ID,
            STAFF_ID: staff.STAFF_ID,
            PERIOD,
            TARGET_VALUE: distributedTargets[index],
            WEIGHT: goal.WEIGHT as never,
            CREATED_AT: now,
            CREATED_BY: session.userId,
            STATE: 'A',
          })
        )

        await goalStaffRepo.save(staffAssignments)
      } catch (error) {
        throw error
      }
    })

    await this.notifyGoalAssignment({
      goal,
      module,
      period: PERIOD,
      totalTarget: TARGET_VALUE,
      staffTargets,
    })

    return this.success({ message: 'Meta asignada al modulo con éxito.' })
  }

  private async getActiveModuleMembers(moduleId: number): Promise<Staff[]> {
    const memberships = await this.staffModuleRepository.find({
      select: ['STAFF_ID'],
      where: {
        MODULE_ID: moduleId,
        STATE: 'A',
      },
    })

    if (!memberships.length) {
      return []
    }

    const memberIds = memberships.map((member) => member.STAFF_ID)

    return this.staffRepositoryLocal.find({
      where: {
        STAFF_ID: In(memberIds),
        STATE: 'A',
      },
      order: { STAFF_ID: 'ASC' },
    })
  }

  private distributeTarget(total: number, size: number): number[] {
    if (size <= 0) {
      return []
    }

    const base = Math.floor(total / size)
    const remainder = total % size

    return Array.from({ length: size }, (_, index) => {
      const extra = index < remainder ? 1 : 0
      return base + extra
    })
  }

  private formatNumber(value: number): string {
    const numeric = Number.isFinite(value) ? Number(value) : 0
    return numeric.toLocaleString('es-DO', { maximumFractionDigits: 0 })
  }

  private formatIsoWeekPeriod(period: number): string {
    const raw = String(period ?? '').padStart(6, '0')
    const year = raw.slice(0, 4)
    const week = Number(raw.slice(4))
    return `Semana ${week} - ${year}`
  }

  private async notifyGoalAssignment({
    goal,
    module,
    period,
    totalTarget,
    staffTargets,
  }: {
    goal: Goal
    module: Module
    period: number
    totalTarget: number
    staffTargets: { staff: Staff; target: number }[]
  }): Promise<void> {
    if (!staffTargets.length) {
      return
    }

    const supervisorStaff = module.SUPERVISOR?.STAFF
    const supervisorName = supervisorStaff
      ? `${supervisorStaff.NAME ?? ''} ${
          supervisorStaff.LAST_NAME ?? ''
        }`.trim()
      : undefined
    const supervisorEmail = supervisorStaff?.EMAIL ?? undefined
    const periodLabel = this.formatIsoWeekPeriod(period)
    const totalTargetFormatted = this.formatNumber(totalTarget)

    await Promise.all(
      staffTargets.map(({ staff, target }) => {
        if (!staff?.EMAIL) {
          return Promise.resolve()
        }

        const staffName = `${staff.NAME ?? ''} ${staff.LAST_NAME ?? ''}`.trim()
        const individualTarget = Number.isFinite(target) ? target : 0
        const individualTargetFormatted = this.formatNumber(individualTarget)

        return publishEmailToQueue({
          to: staff.EMAIL,
          subject: `Nueva meta asignada: ${goal.DESCRIPTION}`,
          templateName: 'goal-assignment',
          text: `Hola ${staffName}, se ha definido la meta "${goal.DESCRIPTION}" para el módulo ${module.DESCRIPTION} durante ${periodLabel}. Tu objetivo asignado es ${individualTargetFormatted}.`,
          record: {
            staffName,
            staffEmail: staff.EMAIL,
            moduleName: module.DESCRIPTION,
            moduleId: module.MODULE_ID,
            goalId: goal.GOAL_ID,
            goalDescription: goal.DESCRIPTION,
            goalWeight: goal.WEIGHT,
            period,
            periodLabel,
            totalTarget,
            totalTargetFormatted,
            individualTarget,
            individualTargetFormatted,
            supervisorName,
            supervisorEmail,
          },
        })
      })
    )
  }

  @CatchServiceError()
  async postProgress(
    payload: PostProgressPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const {
      GOAL_ID,
      SCOPE,
      PERIOD,
      ACTUAL_VALUE,
      ACTUAL_TIME,
      STAFF_ID,
      MODULE_ID,
      CONTRIBUTIONS = [],
    } = payload

    const goal = await this.goalRepository.findOne({ where: { GOAL_ID } })
    if (!goal) throw new NotFoundError('Meta no encontrada.')

    let goalModuleAssignment: GoalModule | null = null
    let moduleIdForProgress: number | null = null

    if (SCOPE === GoalScope.INDIVIDUAL) {
      if (!STAFF_ID) {
        throw new NotFoundError(
          'STAFF_ID es requerido para metas individuales.'
        )
      }
      const staff = await this.staffRepositoryLocal.findOne({
        where: { STAFF_ID },
      })
      if (!staff) throw new NotFoundError('Empleado no encontrado.')

      if (goal.SCOPE === GoalScope.MODULE || MODULE_ID !== undefined) {
        const moduleAssignments = await this.goalModuleRepository.find({
          where: {
            GOAL_ID,
            PERIOD,
            STATE: 'A' as never,
          },
        })

        if (!moduleAssignments.length && goal.SCOPE === GoalScope.MODULE) {
          throw new NotFoundError(
            'La meta no está asignada a ningún módulo en el peri­odo indicado.'
          )
        }

        if (MODULE_ID !== undefined) {
          goalModuleAssignment =
            moduleAssignments.find((item) => item.MODULE_ID === MODULE_ID) ??
            null
        } else if (moduleAssignments.length === 1) {
          goalModuleAssignment = moduleAssignments[0]
        }

        if (goal.SCOPE === GoalScope.MODULE && !goalModuleAssignment) {
          throw new BadRequestError(
            'Debe especificar MODULE_ID para registrar progreso individual cuando la meta está asignada a más de un módulo.'
          )
        }

        moduleIdForProgress = goalModuleAssignment?.MODULE_ID ?? null
      }
    } else {
      if (!MODULE_ID) {
        throw new NotFoundError('MODULE_ID es requerido para metas de módulo.')
      }
      const module = await this.moduleRepository.findOne({
        where: { MODULE_ID },
      })
      if (!module) throw new NotFoundError('Módulo no encontrado.')

      if (goal.SCOPE !== GoalScope.MODULE) {
        throw new BadRequestError(
          'La meta debe ser de alcance módulo para registrar progreso de módulo.'
        )
      }

      goalModuleAssignment = await this.goalModuleRepository.findOne({
        where: {
          GOAL_ID,
          MODULE_ID,
          PERIOD,
          STATE: 'A' as never,
        },
      })

      if (!goalModuleAssignment) {
        throw new NotFoundError(
          'La meta no está asignada al módulo indicado para el peri­odo especificado.'
        )
      }

      moduleIdForProgress = MODULE_ID
    }

    const totalActualTime =
      ACTUAL_TIME === undefined || ACTUAL_TIME === null
        ? null
        : Number(ACTUAL_TIME)

    if (totalActualTime !== null) {
      if (!Number.isFinite(totalActualTime)) {
        throw new BadRequestError(
          'El tiempo reportado debe ser un numero valido.'
        )
      }
      if (totalActualTime < 0) {
        throw new BadRequestError(
          'El tiempo total reportado debe ser mayor o igual a cero.'
        )
      }
    }

    type SanitizedContribution = {
      STAFF_ID: number
      ACTUAL_VALUE: number
      ACTUAL_TIME: number | null
    }

    let sanitizedContributions: SanitizedContribution[] = []
    if (SCOPE === GoalScope.MODULE) {
      sanitizedContributions = CONTRIBUTIONS.map((item) => {
        const actualTime =
          item?.ACTUAL_TIME === undefined || item?.ACTUAL_TIME === null
            ? null
            : Number(item.ACTUAL_TIME)
        return {
          STAFF_ID: Number(item?.STAFF_ID),
          ACTUAL_VALUE: Number(item?.ACTUAL_VALUE ?? 0),
          ACTUAL_TIME: actualTime,
        }
      }).filter((item) => {
        const hasValidId = Number.isInteger(item.STAFF_ID)
        const hasValidValue =
          Number.isInteger(item.ACTUAL_VALUE) && item.ACTUAL_VALUE >= 0
        const hasValidTime =
          item.ACTUAL_TIME === null ||
          (typeof item.ACTUAL_TIME === 'number' &&
            Number.isFinite(item.ACTUAL_TIME) &&
            item.ACTUAL_TIME >= 0)
        return hasValidId && hasValidValue && hasValidTime
      })

      if (sanitizedContributions.length) {
        if (!moduleIdForProgress) {
          throw new BadRequestError(
            'No se pudo determinar el módulo para validar los aportes.'
          )
        }

        const activeMembers = await this.getActiveModuleMembers(
          moduleIdForProgress
        )
        const validStaffIds = new Set(
          activeMembers.map((staff) => staff.STAFF_ID)
        )
        const invalidStaff = sanitizedContributions
          .map((item) => item.STAFF_ID)
          .filter((staffId) => !validStaffIds.has(staffId))

        if (invalidStaff.length) {
          throw new BadRequestError(
            'Los aportes contienen empleados que no pertenecen al módulo o no están activos.'
          )
        }

        const contributionsSum = sanitizedContributions.reduce(
          (acc, item) => acc + item.ACTUAL_VALUE,
          0
        )

        if (contributionsSum !== ACTUAL_VALUE) {
          throw new BadRequestError(
            'La suma de los aportes debe coincidir con el valor total reportado.'
          )
        }

        if (
          totalActualTime !== null &&
          sanitizedContributions.some((item) => item.ACTUAL_TIME !== null)
        ) {
          const contributionsTimeSum = sanitizedContributions.reduce(
            (acc, item) => acc + (item.ACTUAL_TIME ?? 0),
            0
          )

          if (Math.abs(contributionsTimeSum - totalActualTime) > 0.0001) {
            throw new BadRequestError(
              'La suma del tiempo de los aportes debe coincidir con el tiempo total reportado.'
            )
          }
        }
      }
    }

    const now = new Date()

    await this.dataSource.transaction(async (manager) => {
      const progressRepository = manager.getRepository(GoalProgress)

      const baseProgress = progressRepository.create({
        GOAL_ID,
        MODULE_ID: moduleIdForProgress,
        GOAL_MODULE_ID: goalModuleAssignment?.GOAL_MODULE_ID ?? null,
        SCOPE,
        PERIOD,
        ACTUAL_VALUE,
        ACTUAL_TIME: totalActualTime,
        STAFF_ID: SCOPE === GoalScope.INDIVIDUAL ? (STAFF_ID as number) : null,
        CREATED_AT: now,
        CREATED_BY: session.userId,
        STATE: 'A',
      } as never)

      await progressRepository.save(baseProgress)

      if (SCOPE === GoalScope.MODULE && sanitizedContributions.length) {
        const individualRecords = sanitizedContributions.map((item) =>
          progressRepository.create({
            GOAL_ID,
            MODULE_ID: moduleIdForProgress,
            GOAL_MODULE_ID: goalModuleAssignment?.GOAL_MODULE_ID ?? null,
            SCOPE: GoalScope.INDIVIDUAL,
            PERIOD,
            STAFF_ID: item.STAFF_ID,
            ACTUAL_VALUE: item.ACTUAL_VALUE,
            ACTUAL_TIME: item.ACTUAL_TIME,
            CREATED_AT: now,
            CREATED_BY: session.userId,
            STATE: 'A',
          } as never)
        )

        await progressRepository.save(individualRecords as never)
      }
    })

    return this.success({ message: 'Progreso registrado con éxito.' })
  }

  @CatchServiceError()
  async update(payload: Goal, session: SessionInfo) {
    const { GOAL_ID, ...restProps } = payload

    const [goal] = await this.goalRepository.find({ where: { GOAL_ID } })
    if (!goal) {
      throw new NotFoundError(`Meta con id '${GOAL_ID}' no fue encontrado.`)
    }

    this.goalRepository.update(
      { GOAL_ID },
      { ...restProps, UPDATED_AT: new Date(), UPDATED_BY: session.userId }
    )

    return this.success({ message: 'Meta actualizada con éxito.' })
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
      { target: number; weight: number; actual: number; actualTime: number }
    > = {}
    for (const a of assignments) {
      const g = goals.find((x) => x.GOAL_ID === a.GOAL_ID)
      const weight = (a.WEIGHT ?? g?.WEIGHT ?? 0) as unknown as number
      byGoal[a.GOAL_ID] = {
        target: Number(a.TARGET_VALUE || 0),
        weight,
        actual: 0,
        actualTime: 0,
      }
    }
    for (const p of progress) {
      if (!byGoal[p.GOAL_MODULE_ID]) continue
      byGoal[p.GOAL_MODULE_ID].actual += Number(p.ACTUAL_VALUE || 0)
      byGoal[p.GOAL_MODULE_ID].actualTime += Number(p.ACTUAL_TIME ?? 0)
    }

    const details = Object.entries(byGoal).map(([goalId, v]) => {
      const compliance = v.target > 0 ? (v.actual / v.target) * v.weight : 0
      return {
        GOAL_ID: Number(goalId),
        TARGET_VALUE: v.target,
        ACTUAL_VALUE: v.actual,
        WEIGHT: v.weight,
        ACTUAL_TIME: v.actualTime,
        COMPLIANCE: compliance, // puede superar 100 para empleados
      }
    })

    const totalCompliance = details.reduce((acc, d) => acc + d.COMPLIANCE, 0)
    const totalActualTime = details.reduce(
      (acc, d) => acc + (d.ACTUAL_TIME ?? 0),
      0
    )

    return this.success({
      data: {
        STAFF_ID,
        PERIOD,
        TOTAL_COMPLIANCE: totalCompliance,
        TOTAL_ACTUAL_TIME: totalActualTime,
        DETAILS: details,
      },
    })
  }

  // import { In } from 'typeorm'

  @CatchServiceError()
  async getModuleSummary(
    payload: ModuleSummaryPayload,
    _session: SessionInfo
  ): Promise<ApiResponse> {
    const { MODULE_ID, PERIOD } = payload

    // 1) Trae asignaciones activas del perÃ­odo para el módulo
    const goalModules = await this.goalModuleRepository.find({
      where: { MODULE_ID, PERIOD, STATE: 'A' as never },
    })
    const moduleMap = new Map(
      goalModules.map((module) => [module.GOAL_MODULE_ID, module])
    )
    const goalModuleIds = goalModules.map((module) => module.GOAL_MODULE_ID)

    const progress =
      goalModuleIds.length > 0
        ? await this.goalProgressRepository.find({
            where: {
              SCOPE: GoalScope.MODULE,
              GOAL_MODULE_ID: In(goalModuleIds),
              PERIOD,
              STATE: 'A' as never,
            },
          })
        : []

    const dailyTargets =
      goalModuleIds.length > 0
        ? await this.goalDailyTargetRepository.find({
            where: {
              GOAL_MODULE_ID: In(goalModuleIds),
              PERIOD,
              STATE: 'A' as never,
            },
            order: { TARGET_DATE: 'ASC' as never },
          })
        : []

    // 2) IDs de metas activas en el perÃ­odo
    const activeGoalIds = Array.from(
      new Set<number>([
        ...goalModules.map((module) => module.GOAL_ID),
        ...progress.map((item) => item.GOAL_ID),
      ])
    )
    // ðŸ‘‰ Si quieres SOLO metas con asignación del perÃ­odo:
    // const activeGoalIds = Array.from(new Set(assignments.map(a => a.GOAL_ID)))

    if (activeGoalIds.length === 0) return this.noContent()

    // 3) Trae SOLO las metas activas (WEIGHT está en GOAL)
    const goals = await this.goalRepository.find({
      where: { SCOPE: GoalScope.MODULE, GOAL_ID: In(activeGoalIds) },
    })
    if (!goals.length) return this.noContent()

    const dailyTargetsByGoal = dailyTargets.reduce((acc, target) => {
      const goalId = moduleMap.get(target.GOAL_MODULE_ID)?.GOAL_ID
      if (!goalId) return acc
      const targetTime =
        target.TARGET_TIME === null || target.TARGET_TIME === undefined
          ? null
          : Number(target.TARGET_TIME)
      ;(acc[goalId] ||= []).push({
        TARGET_DATE: target.TARGET_DATE,
        TARGET_VALUE: Number(target.TARGET_VALUE ?? 0),
        TARGET_TIME: targetTime,
      })
      return acc
    }, {} as Record<number, GoalDailyTargetPayload[]>)

    // 4) Inicializa acumuladores por meta
    const byGoal: Record<
      number,
      {
        target: number
        weight: number
        actual: number
        description: string
        state: string
        targetTime: number
        actualTime: number
      }
    > = {}
    for (const g of goals) {
      byGoal[g.GOAL_ID] = {
        target: 0,
        weight: Number(g.WEIGHT ?? 0), // Peso base tomado de GOAL
        actual: 0,
        description: g.DESCRIPTION,
        state: g.STATE,
        targetTime: 0,
        actualTime: 0,
      }
    }

    // 5) Acumula tiempo objetivo diario
    for (const [goalId, targets] of Object.entries(dailyTargetsByGoal)) {
      const entry = byGoal[Number(goalId)]
      if (!entry) continue
      entry.targetTime += targets.reduce(
        (acc, item) => acc + Number(item.TARGET_TIME ?? 0),
        0
      )
    }

    // 6) Suma target por asignaciones del periodo
    for (const module of goalModules) {
      const entry = byGoal[module.GOAL_ID]
      if (!entry) continue
      entry.target += Number(module.TARGET_VALUE ?? 0)
    }

    // 7) Suma actual por progreso del periodo
    for (const p of progress) {
      const entry = byGoal[p.GOAL_ID]
      if (!entry) continue
      entry.actual += Number(p.ACTUAL_VALUE ?? 0)
      entry.actualTime += Number(p.ACTUAL_TIME ?? 0)
    }

    // 8) Logs de progreso por meta
    const progressByGoal = progress.reduce(
      (acc, item) => {
        const key = item.GOAL_ID
        ;(acc[key] ||= []).push({
          GOAL_PROGRESS_ID: item.GOAL_PROGRESS_ID,
          ACTUAL_VALUE: Number(item.ACTUAL_VALUE ?? 0),
          ACTUAL_TIME: Number(item.ACTUAL_TIME ?? 0),
          CREATED_AT: item.CREATED_AT,
          UPDATED_AT: item.UPDATED_AT,
        })
        return acc
      },
      {} as Record<
        number,
        {
          GOAL_PROGRESS_ID: number
          ACTUAL_VALUE: number
          ACTUAL_TIME: number
          CREATED_AT: Date | null
          UPDATED_AT: Date | null
        }[]
      >
    )

    // 9) Detalles SOLO para metas activas del periodo
    const details = activeGoalIds
      .filter((id) => byGoal[id]) // por si alguna quedó fuera
      .map((id) => {
        const entry = byGoal[id]
        const raw = entry.target > 0 ? entry.actual / entry.target : 0
        const capped = Math.min(raw, 1) // cap 100% por meta
        const compliance = capped * entry.weight
        const timeRatio =
          entry.targetTime > 0 ? entry.actualTime / entry.targetTime : null
        const timeVariance =
          entry.targetTime > 0 ? entry.actualTime - entry.targetTime : null

        const logs = [...(progressByGoal[id] ?? [])].sort((a, b) => {
          const ta = (a.CREATED_AT ?? a.UPDATED_AT)?.valueOf() ?? 0
          const tb = (b.CREATED_AT ?? b.UPDATED_AT)?.valueOf() ?? 0
          return ta - tb
        })
        const lastUpdate = logs.reduce<Date | null>((acc, cur) => {
          const d = (cur.UPDATED_AT || cur.CREATED_AT) as unknown as Date
          return !acc || (d && d > acc) ? d : acc
        }, null)

        return {
          GOAL_ID: id,
          DESCRIPTION: entry.description,
          STATE: entry.state,
          TARGET_VALUE: entry.target,
          ACTUAL_VALUE: entry.actual,
          WEIGHT: entry.weight,
          COMPLIANCE: compliance,
          TARGET_TIME: entry.targetTime,
          ACTUAL_TIME: entry.actualTime,
          TIME_EFFICIENCY: timeRatio !== null ? timeRatio * 100 : null,
          TIME_VARIANCE: timeVariance,
          UPDATED_AT: lastUpdate || null,
          PROGRESS_LOGS: logs,
          DAILY_TARGETS: dailyTargetsByGoal[id] ?? [],
        }
      })

    const sum = details.reduce((acc, d) => acc + d.COMPLIANCE, 0)
    const TOTAL_COMPLIANCE = Math.min(sum, 100) // cap total 100%
    const TOTAL_TARGET_TIME = details.reduce(
      (acc, d) => acc + Number(d.TARGET_TIME ?? 0),
      0
    )
    const TOTAL_ACTUAL_TIME = details.reduce(
      (acc, d) => acc + Number(d.ACTUAL_TIME ?? 0),
      0
    )

    return this.success({
      data: {
        MODULE_ID,
        PERIOD,
        TOTAL_COMPLIANCE,
        TOTAL_TARGET_TIME,
        TOTAL_ACTUAL_TIME,
        DETAILS: details,
      },
    })
  }

  @CatchServiceError()
  async getGoalsByModule(
    moduleId: number,
    period: number
  ): Promise<ApiResponse> {
    const goalModule = await this.goalModuleRepository.find({
      select: ['GOAL_ID'],
      where: {
        MODULE_ID: moduleId,
        STATE: 'A',
        PERIOD: period,
      },
    })

    const goals = await this.goalRepository.find({
      order: { GOAL_ID: 'DESC' as never },
      where: {
        SCOPE: 'module' as never,
        STATE: 'A',
        GOAL_ID: In(goalModule.map((item) => item.GOAL_ID)),
      },
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
      WITH MODULES AS (
        SELECT
          gm."GOAL_MODULE_ID",
          gm."GOAL_ID",
          gm."MODULE_ID",
          gm."PERIOD",
          g."DESCRIPTION",
          g."WEIGHT",
          g."STATE"
        FROM public."GOAL_X_MODULE" gm
        INNER JOIN public."GOAL" g
          ON g."GOAL_ID" = gm."GOAL_ID"
        WHERE gm."STATE" = 'A'
          AND g."SCOPE" = 'module'
      ),
      TARGET AS (
        SELECT
          gdt."GOAL_MODULE_ID",
          gdt."PERIOD",
          gdt."TARGET_DATE",
          SUM(gdt."TARGET_VALUE") AS "TARGET_VALUE",
          SUM(COALESCE(gdt."TARGET_TIME", 0)) AS "TARGET_TIME"
        FROM public."GOAL_DAILY_TARGET" gdt
        WHERE gdt."STATE" = 'A'
        GROUP BY gdt."GOAL_MODULE_ID", gdt."PERIOD", gdt."TARGET_DATE"
      ),
      PROGRESS AS (
        SELECT
          gp."GOAL_MODULE_ID",
          gp."PERIOD",
          DATE(COALESCE(gp."UPDATED_AT", gp."CREATED_AT")) AS "TARGET_DATE",
          SUM(gp."ACTUAL_VALUE") AS "ACTUAL_VALUE",
          SUM(COALESCE(gp."ACTUAL_TIME", 0)) AS "ACTUAL_TIME",
          MAX(COALESCE(gp."UPDATED_AT", gp."CREATED_AT")) AS "LAST_UPDATE"
        FROM public."GOAL_PROGRESS" gp
        WHERE gp."STATE" = 'A'
          AND gp."SCOPE" = 'module'
          AND gp."GOAL_MODULE_ID" IS NOT NULL
        GROUP BY gp."GOAL_MODULE_ID",
                 gp."PERIOD",
                 DATE(COALESCE(gp."UPDATED_AT", gp."CREATED_AT"))
      ),
      DATA AS (
        SELECT
          m."GOAL_MODULE_ID",
          m."GOAL_ID",
          m."DESCRIPTION",
          m."WEIGHT",
          m."STATE",
          m."MODULE_ID",
          m."PERIOD",
          t."TARGET_DATE",
          t."TARGET_VALUE",
          t."TARGET_TIME",
          COALESCE(p."ACTUAL_VALUE", 0) AS "ACTUAL_VALUE",
          COALESCE(p."ACTUAL_TIME", 0) AS "ACTUAL_TIME",
          p."LAST_UPDATE"
        FROM MODULES m
        JOIN TARGET t
          ON t."GOAL_MODULE_ID" = m."GOAL_MODULE_ID"
         AND t."PERIOD" = m."PERIOD"
        LEFT JOIN PROGRESS p
          ON p."GOAL_MODULE_ID" = m."GOAL_MODULE_ID"
         AND p."PERIOD" = m."PERIOD"
         AND p."TARGET_DATE" = t."TARGET_DATE"
      )
      SELECT
        sub.*,
        CASE
          WHEN sub."TARGET_VALUE_ACC" = 0 THEN NULL
          ELSE ROUND(
            LEAST(
              COALESCE(sub."ACTUAL_VALUE_ACC", 0)::decimal
              / NULLIF(sub."TARGET_VALUE_ACC", 0)
              * 100,
              100
            ),
            2
          )
        END AS "COMPLIANCE",
        CASE
          WHEN sub."TARGET_TIME_ACC" = 0 THEN NULL
          ELSE ROUND(
            COALESCE(sub."ACTUAL_TIME_ACC", 0)::decimal
            / NULLIF(sub."TARGET_TIME_ACC", 0)
            * 100,
            2
          )
        END AS "TIME_EFFICIENCY",
        COALESCE(sub."ACTUAL_TIME", 0) - COALESCE(sub."TARGET_TIME", 0) AS "TIME_VARIANCE",
        COALESCE(sub."ACTUAL_TIME_ACC", 0) - COALESCE(sub."TARGET_TIME_ACC", 0) AS "TIME_VARIANCE_ACC"
      FROM (
        SELECT
          d."GOAL_MODULE_ID",
          d."GOAL_ID",
          d."DESCRIPTION",
          d."WEIGHT",
          d."STATE",
          d."MODULE_ID",
          d."PERIOD",
          d."TARGET_DATE",
          d."TARGET_VALUE",
          d."TARGET_TIME",
          d."ACTUAL_VALUE",
          d."ACTUAL_TIME",
          SUM(d."TARGET_VALUE") OVER w AS "TARGET_VALUE_ACC",
          SUM(d."TARGET_TIME") OVER w AS "TARGET_TIME_ACC",
          SUM(d."ACTUAL_VALUE") OVER w AS "ACTUAL_VALUE_ACC",
          SUM(d."ACTUAL_TIME") OVER w AS "ACTUAL_TIME_ACC",
          d."LAST_UPDATE" AS "UPDATED_AT",
          d."DESCRIPTION" || ' ' || d."GOAL_ID" || ' ' ||
            to_char(d."TARGET_DATE", 'YYYY-MM-DD') AS "FILTER"
        FROM DATA d
        WINDOW w AS (
          PARTITION BY d."GOAL_MODULE_ID", d."PERIOD"
          ORDER BY d."TARGET_DATE"
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )
      ) AS sub
      ${whereClause}
      ORDER BY
        "GOAL_ID" DESC,
        "MODULE_ID" DESC NULLS LAST,
        "PERIOD" DESC NULLS LAST,
        "TARGET_DATE" ASC
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

  @CatchServiceError()
  public async getGoalsPagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { whereClause, values } = whereClauseBuilder(payload)

    const statement = `
      SELECT
        *
      FROM 
        (
          SELECT 
            g."GOAL_ID",
            g."DESCRIPTION",
            g."START_DATE",
            g."END_DATE",
            g."STATE",
            g."WEIGHT",
            g."TARGET_VALUE",
            g."CREATED_AT",
            g."GOAL_ID" || ' ' || g."DESCRIPTION" || ' ' || g."SCOPE" AS "FILTER"
          FROM 
            public."GOAL" g
        ) AS subquery
      ${whereClause}
      ORDER BY "GOAL_ID"
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
