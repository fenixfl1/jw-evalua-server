import { In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Evaluation } from '@src/entity/Evaluation'
import { EvaluationDetail } from '@src/entity/EvaluationDetail'
import { Competency } from '@src/entity/Competency'
import { Module } from '@src/entity/Module'
import { Staff } from '@src/entity/Staff'
import { GoalStaff } from '@src/entity/GoalStaff'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { NotFoundError } from '@src/errors/http.error'
import { paginatedQuery } from '@src/helpers/query-utils'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'

interface EvaluationDetailInput {
  COMPETENCY_ID: number
  GOAL_STAFF_ID?: number | null
  WEIGHT?: number | null
  SCORE?: number | null
  COMMENT?: string | null
}

interface UpdateEvaluationDetailInput extends EvaluationDetailInput {
  EVALUATION_DETAIL_ID?: number
  _ACTION?: 'create' | 'update' | 'delete'
}

interface CreateEvaluationPayload {
  MODULE_ID: number
  STAFF_ID: number
  EVALUATOR_ID?: number | null
  PERIOD: number
  OVERALL_SCORE?: number | null
  COMMENTS?: string | null
  DETAILS: EvaluationDetailInput[]
}

interface UpdateEvaluationPayload {
  MODULE_ID?: number
  STAFF_ID?: number
  EVALUATOR_ID?: number | null
  PERIOD?: number
  OVERALL_SCORE?: number | null
  COMMENTS?: string | null
  DETAILS?: UpdateEvaluationDetailInput[]
  STATE?: 'A' | 'I'
}

export class EvaluationService extends BaseService {
  private evaluationRepository: Repository<Evaluation>
  private evaluationDetailRepository: Repository<EvaluationDetail>
  private competencyRepository: Repository<Competency>
  private moduleRepository: Repository<Module>
  private staffRepositoryLocal: Repository<Staff>
  private goalStaffRepository: Repository<GoalStaff>

  constructor() {
    super()
    this.evaluationRepository = this.dataSource.getRepository(Evaluation)
    this.evaluationDetailRepository =
      this.dataSource.getRepository(EvaluationDetail)
    this.competencyRepository = this.dataSource.getRepository(Competency)
    this.moduleRepository = this.dataSource.getRepository(Module)
    this.staffRepositoryLocal = this.dataSource.getRepository(Staff)
    this.goalStaffRepository = this.dataSource.getRepository(GoalStaff)
  }

  @CatchServiceError()
  async create(
    payload: CreateEvaluationPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { MODULE_ID, STAFF_ID, PERIOD, OVERALL_SCORE, COMMENTS, DETAILS } =
      payload

    const evaluator = await this.getUser(session.username)

    await this.ensureModuleExists(MODULE_ID)
    const evaluatedStaff = await this.ensureStaffExists(STAFF_ID)

    const competencyIds = [
      ...new Set(DETAILS.map((detail) => detail.COMPETENCY_ID)),
    ]
    if (competencyIds.length) {
      const competencies = await this.competencyRepository.find({
        where: { COMPETENCY_ID: In(competencyIds) },
      })
      if (competencies.length !== competencyIds.length) {
        throw new NotFoundError('Una o mas competencias no existen.')
      }
    }

    await this.validateGoalAssignments({
      details: DETAILS,
      staffId: evaluatedStaff.STAFF_ID,
      period: PERIOD,
    })

    const savedEvaluation = await this.dataSource.transaction(
      async (manager) => {
        const evaluationRepo = manager.getRepository(Evaluation)
        const detailRepo = manager.getRepository(EvaluationDetail)

        const entity = evaluationRepo.create({
          MODULE_ID,
          STAFF_ID,
          EVALUATOR_ID: evaluator.STAFF_ID,
          PERIOD,
          OVERALL_SCORE: OVERALL_SCORE ?? null,
          COMMENTS: COMMENTS ?? null,
          CREATED_BY: session.userId,
          STATE: 'A',
        })

        const evaluation = await evaluationRepo.save(entity)

        if (DETAILS.length) {
          const detailEntities = DETAILS.map((detail) =>
            detailRepo.create({
              ...detail,
              GOAL_STAFF_ID: detail.GOAL_STAFF_ID ?? null,
              WEIGHT: detail.WEIGHT ?? null,
              SCORE: detail.SCORE ?? null,
              COMMENT: detail.COMMENT ?? null,
              EVALUATION_ID: evaluation.EVALUATION_ID,
              CREATED_BY: session.userId,
              STATE: 'A',
            })
          )

          await detailRepo.save(detailEntities)
        }

        return evaluation
      }
    )

    const data = await this.getEvaluationById(savedEvaluation.EVALUATION_ID)
    return this.success({
      message: 'Evaluación creada con éxito.',
      data,
    })
  }

  @CatchServiceError()
  async update(
    evaluationId: number,
    payload: UpdateEvaluationPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { EVALUATION_ID: evaluationId },
    })

    if (!evaluation) {
      throw new NotFoundError('Evaluación no encontrada.')
    }

    if (payload.MODULE_ID) {
      await this.ensureModuleExists(payload.MODULE_ID)
    }

    if (payload.STAFF_ID) {
      await this.ensureStaffExists(payload.STAFF_ID)
    }

    if (payload.EVALUATOR_ID) {
      await this.ensureStaffExists(payload.EVALUATOR_ID)
    }

    const { DETAILS: detailsPayload = [], ...evaluationData } = payload

    if (detailsPayload.length) {
      const competencyIds = [
        ...new Set(detailsPayload.map((detail) => detail.COMPETENCY_ID)),
      ].filter((id): id is number => typeof id === 'number')

      if (competencyIds.length) {
        const competencies = await this.competencyRepository.find({
          where: { COMPETENCY_ID: In(competencyIds) },
        })
        if (competencies.length !== competencyIds.length) {
          throw new NotFoundError('Una o mas competencias no existen.')
        }
      }

      const targetPeriod = evaluationData.PERIOD ?? evaluation.PERIOD
      const targetStaffId = evaluationData.STAFF_ID ?? evaluation.STAFF_ID

      await this.validateGoalAssignments({
        details: detailsPayload,
        staffId: targetStaffId,
        period: targetPeriod,
      })
    }

    await this.dataSource.transaction(async (manager) => {
      const evaluationRepo = manager.getRepository(Evaluation)
      const detailRepo = manager.getRepository(EvaluationDetail)

      const updatePayload: Partial<Evaluation> = { UPDATED_BY: session.userId }

      if (evaluationData.MODULE_ID !== undefined) {
        updatePayload.MODULE_ID = evaluationData.MODULE_ID
      }
      if (evaluationData.STAFF_ID !== undefined) {
        updatePayload.STAFF_ID = evaluationData.STAFF_ID
      }
      if (evaluationData.EVALUATOR_ID !== undefined) {
        updatePayload.EVALUATOR_ID = evaluationData.EVALUATOR_ID
      }
      if (evaluationData.PERIOD !== undefined) {
        updatePayload.PERIOD = evaluationData.PERIOD
      }
      if (evaluationData.OVERALL_SCORE !== undefined) {
        updatePayload.OVERALL_SCORE = evaluationData.OVERALL_SCORE
      }
      if (evaluationData.COMMENTS !== undefined) {
        updatePayload.COMMENTS = evaluationData.COMMENTS
      }
      if (evaluationData.STATE !== undefined) {
        updatePayload.STATE = evaluationData.STATE
      }

      evaluationRepo.merge(evaluation, updatePayload)
      await evaluationRepo.save(evaluation)

      if (!detailsPayload.length) {
        return
      }

      for (const detail of detailsPayload) {
        const action =
          detail._ACTION ?? (detail.EVALUATION_DETAIL_ID ? 'update' : 'create')

        if (action === 'delete') {
          if (!detail.EVALUATION_DETAIL_ID) {
            continue
          }
          await detailRepo.delete({
            EVALUATION_DETAIL_ID: detail.EVALUATION_DETAIL_ID,
            EVALUATION_ID: evaluationId,
          })
          continue
        }

        if (action === 'create') {
          const entity = detailRepo.create({
            EVALUATION_ID: evaluationId,
            COMPETENCY_ID: detail.COMPETENCY_ID,
            GOAL_STAFF_ID: detail.GOAL_STAFF_ID ?? null,
            WEIGHT: detail.WEIGHT ?? null,
            SCORE: detail.SCORE ?? null,
            COMMENT: detail.COMMENT ?? null,
            CREATED_BY: session.userId,
            STATE: 'A',
          })
          await detailRepo.save(entity)
          continue
        }

        if (!detail.EVALUATION_DETAIL_ID) {
          this.fail(
            'El identificador del detalle es requerido para actualizar.',
            400
          )
        }

        const existing = await detailRepo.findOne({
          where: {
            EVALUATION_DETAIL_ID: detail.EVALUATION_DETAIL_ID!,
            EVALUATION_ID: evaluationId,
          },
        })

        if (!existing) {
          throw new NotFoundError('Detalle de evaluacion no encontrado.')
        }

        detailRepo.merge(existing, {
          COMPETENCY_ID: detail.COMPETENCY_ID ?? existing.COMPETENCY_ID,
          GOAL_STAFF_ID: detail.GOAL_STAFF_ID ?? null,
          WEIGHT: detail.WEIGHT ?? null,
          SCORE: detail.SCORE ?? null,
          COMMENT: detail.COMMENT ?? null,
          UPDATED_BY: session.userId,
        })

        await detailRepo.save(existing)
      }
    })

    const data = await this.getEvaluationById(evaluationId)
    return this.success({
      message: 'Evaluación actualizada con exito.',
      data,
    })
  }

  @CatchServiceError()
  async getEvaluation(
    evaluationId: number
  ): Promise<ApiResponse<Evaluation | null>> {
    const data = await this.getEvaluationById(evaluationId)
    if (!data) {
      return this.noContent()
    }
    return this.success({ data })
  }

  @CatchServiceError()
  async getEvaluationsPagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { whereClause, values } = whereClauseBuilder(payload)

    const statement = `
      SELECT
        *
      FROM (
        SELECT
          e."EVALUATION_ID",
          e."MODULE_ID",
          m."DESCRIPTION" AS "MODULE_NAME",
          e."STAFF_ID",
          staff."NAME" || ' ' || staff."LAST_NAME" AS "STAFF_NAME",
          e."EVALUATOR_ID",
          evaluator."NAME" || ' ' || evaluator."LAST_NAME" AS "EVALUATOR_NAME",
          e."PERIOD",
          e."OVERALL_SCORE",
          e."COMMENTS",
          e."STATE",
          e."CREATED_AT",
          e."UPDATED_AT",
          (e."EVALUATION_ID"::text || ' ' || COALESCE(m."DESCRIPTION", '') || ' ' ||
            COALESCE(staff."NAME", '') || ' ' || COALESCE(staff."LAST_NAME", '')) AS "FILTER"
        FROM public."EVALUATION" e
        LEFT JOIN public."MODULE" m ON m."MODULE_ID" = e."MODULE_ID"
        LEFT JOIN public."STAFF" staff ON staff."STAFF_ID" = e."STAFF_ID"
        LEFT JOIN public."STAFF" evaluator ON evaluator."STAFF_ID" = e."EVALUATOR_ID"
      ) AS subquery
      ${whereClause}
      ORDER BY "EVALUATION_ID" DESC
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

  private async getEvaluationById(
    evaluationId: number
  ): Promise<Evaluation | null> {
    return this.evaluationRepository.findOne({
      where: { EVALUATION_ID: evaluationId },
      relations: {
        MODULE: true,
        STAFF: true,
        EVALUATOR: true,
        DETAILS: {
          COMPETENCY: true,
          GOAL_ASSIGNMENT: {
            GOAL: true,
          },
        },
      },
      order: {
        DETAILS: {
          EVALUATION_DETAIL_ID: 'ASC',
        },
      },
    })
  }

  private async ensureModuleExists(moduleId: number): Promise<void> {
    const module = await this.moduleRepository.findOne({
      where: { MODULE_ID: moduleId },
    })
    if (!module) {
      throw new NotFoundError('Modulo no encontrado.')
    }
  }

  private async ensureStaffExists(staffId: number): Promise<Staff> {
    const staff = await this.staffRepositoryLocal.findOne({
      where: { STAFF_ID: staffId },
    })
    if (!staff) {
      throw new NotFoundError('Colaborador no encontrado.')
    }
    return staff
  }

  private async validateGoalAssignments({
    details,
    staffId,
    period,
  }: {
    details: EvaluationDetailInput[]
    staffId: number
    period: number
  }): Promise<void> {
    const goalStaffIds = details
      .map((detail) => detail.GOAL_STAFF_ID)
      .filter((value): value is number => value !== null && value !== undefined)

    if (!goalStaffIds.length) {
      return
    }

    const assignments = await this.goalStaffRepository.find({
      where: { GOAL_STAFF_ID: In(goalStaffIds) },
      relations: {
        STAFF: true,
      },
    })

    if (assignments.length !== goalStaffIds.length) {
      throw new NotFoundError('Una o mas asignaciones de metas no existen.')
    }

    assignments.forEach((assignment) => {
      if (assignment.STAFF_ID !== staffId) {
        throw new NotFoundError(
          `La asignacion ${assignment.GOAL_STAFF_ID} no pertenece al colaborador evaluado.`
        )
      }

      if (assignment.PERIOD !== period) {
        throw new NotFoundError(
          `La asignacion ${assignment.GOAL_STAFF_ID} no corresponde al periodo evaluado.`
        )
      }
    })
  }
}
