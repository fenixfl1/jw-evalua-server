import { In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Module } from '@src/entity/Module'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { NotFoundError } from '@src/errors/http.error'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginatedQuery, queryRunner } from '@src/helpers/query-utils'
import { HTTP_STATUS_NO_CONTENT } from '@src/constants/status-codes'
import { StaffModule } from '@src/entity/StaffXModule'
import { Staff } from '@src/entity/Staff'

interface CreateModulePayload {
  DESCRIPTION: string
  SUPERVISOR_ID: number
  MEMBERS?: number[]
}

interface CreateOrUpdateMembersPayload {
  MODULE_ID: number
  MEMBERS: { STAFF_ID: number; STATE: string }[]
}

export class ModuleService extends BaseService {
  private moduleRepository: Repository<Module>
  private staffModuleRepository: Repository<StaffModule>

  constructor() {
    super()
    this.staffModuleRepository = this.dataSource.getRepository(StaffModule)
    this.moduleRepository = this.dataSource.getRepository(Module)
  }

  @CatchServiceError()
  async create(
    payload: CreateModulePayload,
    session: SessionInfo
  ): Promise<ApiResponse<Module>> {
    const { SUPERVISOR_ID, MEMBERS, DESCRIPTION } = payload
    const supervisor = await this.userRepository.findOne({
      where: { USER_ID: SUPERVISOR_ID },
    })
    if (!supervisor) {
      throw new NotFoundError('Supervisor no encontrado.')
    }

    if (MEMBERS && MEMBERS.length) {
      const members = await this.staffRepository.findBy({
        STAFF_ID: In(MEMBERS),
      })
      if (members.length !== MEMBERS.length) {
        throw new NotFoundError('Algunos miembros no fueron encontrados.')
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const module = this.moduleRepository.create({
        DESCRIPTION,
        SUPERVISOR: supervisor,
        CREATED_AT: new Date(),
        CREATED_BY: session.userId,
        STATE: 'A',
      })

      const newModule = await manager.save(module)

      const memberships = MEMBERS.map((id) => ({
        STAFF_ID: id,
        MODULE: newModule,
        STATE: 'A',
        CREATED_AT: new Date(),
        CREATED_BY: session.userId,
      }))

      if (memberships.length) {
        await manager.save(StaffModule, memberships)
      }

      return this.success({ message: 'Módulo creado con éxito.' })
    })
  }

  @CatchServiceError()
  async update(
    payload: Module,
    session: SessionInfo
  ): Promise<ApiResponse<Module>> {
    const { MODULE_ID, SUPERVISOR_ID } = payload

    const module = await this.moduleRepository.findOne({ where: { MODULE_ID } })
    if (!module) {
      throw new NotFoundError('Módulo no encontrado.')
    }

    const supervisor = await this.userRepository.findOne({
      where: { USER_ID: SUPERVISOR_ID },
    })
    if (!supervisor) {
      throw new NotFoundError('Supervisor no encontrado.')
    }

    await this.moduleRepository.update(
      { MODULE_ID },
      {
        ...payload,
        SUPERVISOR: supervisor,
        UPDATED_BY: session.userId,
        UPDATED_AT: new Date(),
      }
    )

    return this.success({
      message: 'Módulo actualizado con éxito.',
    })
  }

  @CatchServiceError()
  async get_pagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse<Module[]>> {
    const { values, whereClause } = whereClauseBuilder(payload)

    const statement = `
      SELECT 
        *
      FROM (
        SELECT 
          m."MODULE_ID",
          m."DESCRIPTION",
          m."SUPERVISOR_ID",
          m."CREATED_AT",
          m."CREATED_BY",
          m."UPDATED_AT",
          m."UPDATED_BY",
          m."STATE",
          s."NAME" || ' ' || s."LAST_NAME" AS "SUPERVISOR_NAME",
          (
            SELECT ARRAY_AGG(sm."STAFF_ID") 
            FROM "STAFF_X_MODULE" sm 
            WHERE sm."MODULE_ID" = m."MODULE_ID" 
              AND sm."STATE" = 'A'
          ) AS "MEMBERS",
          m."DESCRIPTION" || ' ' || m."MODULE_ID" || ' ' || s."NAME" || ' ' || s."LAST_NAME" AS "FILTER"
        FROM
          public."MODULE" m
          LEFT JOIN public."USERS" u  ON m."SUPERVISOR_ID" = u."USER_ID"
          LEFT JOIN public."STAFF" s ON u."STAFF_ID" = s."STAFF_ID"
      ) SUBQUERY
      ${whereClause}
      ORDER BY "MODULE_ID"
    `

    const [result = [], metadata] = await paginatedQuery<Module>({
      statement,
      values,
      pagination,
    })

    if (!result.length) {
      return this.noContent()
    }

    const data: Module[] = []
    for (const module of result) {
      const members = await this.getMembers(module.MODULE_ID, [
        'STAFF_ID',
        'NAME',
        'LAST_NAME',
      ])

      data.push({ ...module, MEMBERS: members })
    }

    return this.success({ data, metadata })
  }

  @CatchServiceError()
  async getById(moduleId: number): Promise<ApiResponse<Module>> {
    const statement = `
      SELECT 
        *
      FROM (
        SELECT 
          m."MODULE_ID",
          m."DESCRIPTION",
          m."SUPERVISOR_ID",
          m."CREATED_AT",
          m."CREATED_BY",
          m."UPDATED_AT",
          m."UPDATED_BY",
          m."STATE",
          s."NAME" || ' ' || s."LAST_NAME" AS "SUPERVISOR_NAME",
          (
            SELECT ARRAY_AGG(sm."STAFF_ID") 
            FROM "STAFF_X_MODULE" sm 
            WHERE sm."MODULE_ID" = m."MODULE_ID" 
              AND sm."STATE" = 'A'
          ) AS "MEMBERS",
          m."DESCRIPTION" || ' ' || m."MODULE_ID" || ' ' || s."NAME" || ' ' || s."LAST_NAME" AS "FILTER"
        FROM
          public."MODULE" m
          LEFT JOIN public."USER" u  ON m."SUPERVISOR_ID" = u."USER_ID"
          LEFT JOIN public."STAFF" s ON u."STAFF_ID" = s."STAFF_ID"
      ) AS SUBQUERY
      WHERE
        "MODULE_ID" = $1
    `

    const [data] = await queryRunner<Module>(statement, [moduleId])

    if (!data) {
      return this.noContent()
    }

    return this.success({ data })
  }

  @CatchServiceError()
  async createOrUpdateMembers(
    payload: CreateOrUpdateMembersPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { MODULE_ID, MEMBERS } = payload

    const module = await this.moduleRepository.findOne({
      where: { MODULE_ID },
    })
    if (!module) {
      throw new NotFoundError('Módulo no encontrado.')
    }

    const staffIds = MEMBERS.map((m) => m.STAFF_ID)
    const existingMembers = await this.staffModuleRepository.find({
      where: { MODULE_ID, STAFF_ID: In(staffIds) },
    })
    const existingMap = new Map(existingMembers.map((em) => [em.STAFF_ID, em]))

    const data = MEMBERS.map((member) => {
      const existingMember = existingMap.get(member.STAFF_ID)

      return {
        ...(existingMember
          ? { STAFF_MODULE_ID: existingMember.STAFF_MODULE_ID }
          : {}),
        ...member,
        MODULE: module,
        CREATED_AT: existingMember ? existingMember.CREATED_AT : new Date(),
        UPDATED_AT: existingMember ? new Date() : null,
        UPDATED_BY: existingMember ? session.userId : null,
        CREATED_BY: existingMember ? existingMember.CREATED_BY : session.userId,
      }
    })

    await this.staffModuleRepository.save(data)

    return this.success({ message: 'Operación completada con éxito.' })
  }

  @CatchServiceError()
  private async getMembers(
    moduleId: number,
    select?: (keyof Staff)[]
  ): Promise<Staff[]> {
    const members = await this.staffModuleRepository.find({
      select: ['STAFF_ID'],
      where: {
        MODULE_ID: moduleId,
        STATE: 'A',
      },
    })

    const staff = await this.staffRepository.find({
      select,
      where: {
        STAFF_ID: In(members.map((m) => m.STAFF_ID)),
        STATE: 'A',
      },
    })

    return staff
  }
}
