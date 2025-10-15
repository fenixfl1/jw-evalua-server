import { In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Module } from '@src/entity/Module'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
  SimpleCondition,
} from '@src/types/api.types'
import { NotFoundError } from '@src/errors/http.error'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginatedQuery, queryRunner } from '@src/helpers/query-utils'
import { HTTP_STATUS_NO_CONTENT } from '@src/constants/status-codes'
import { StaffModule } from '@src/entity/StaffXModule'
import { Staff } from '@src/entity/Staff'
import { publishEmailToQueue } from './email/email-producer.service'

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
      relations: ['STAFF'],
    })
    if (!supervisor) {
      throw new NotFoundError('Supervisor no encontrado.')
    }

    const memberIds = MEMBERS ?? []

    if (memberIds.length) {
      const members = await this.staffRepository.findBy({
        STAFF_ID: In(memberIds),
      })
      if (members.length !== memberIds.length) {
        throw new NotFoundError('Algunos miembros no fueron encontrados.')
      }
    }

    let staffToNotify: Staff[] = []
    let createdModule: Module | null = null

    return await this.dataSource.transaction(async (manager) => {
      const moduleEntity = this.moduleRepository.create({
        DESCRIPTION,
        SUPERVISOR: supervisor,
        CREATED_AT: new Date(),
        CREATED_BY: session.userId,
        STATE: 'A',
      })

      const newModule = await manager.save(moduleEntity)
      createdModule = { ...newModule, SUPERVISOR: supervisor }

      const memberships = memberIds.map((id) => ({
        STAFF_ID: id,
        MODULE: newModule,
        STATE: 'A',
        CREATED_AT: new Date(),
        CREATED_BY: session.userId,
      }))

      if (memberships.length) {
        await manager.save(StaffModule, memberships)
        staffToNotify = await manager.getRepository(Staff).find({
          where: { STAFF_ID: In(memberIds) },
        })
      }

      if (createdModule && staffToNotify.length) {
        await this.notifyModuleAssignments({
          module: createdModule,
          staffMembers: staffToNotify,
        })
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
      relations: ['SUPERVISOR', 'SUPERVISOR.STAFF'],
    })
    if (!module) {
      throw new NotFoundError('Módulo no encontrado.')
    }

    const staffIds = MEMBERS.map((m) => m.STAFF_ID)
    const existingMembers = await this.staffModuleRepository.find({
      where: { MODULE_ID, STAFF_ID: In(staffIds) },
    })
    const existingMap = new Map(existingMembers.map((em) => [em.STAFF_ID, em]))
    const staffIdsToNotify: number[] = []

    const data = MEMBERS.map((member) => {
      const existingMember = existingMap.get(member.STAFF_ID)
      const isActivating =
        member.STATE === 'A' &&
        (!existingMember || existingMember.STATE !== 'A')

      if (isActivating) {
        staffIdsToNotify.push(member.STAFF_ID)
      }

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

    if (staffIdsToNotify.length) {
      const staffMembers = await this.staffRepository.find({
        where: { STAFF_ID: In(staffIdsToNotify) },
      })

      if (staffMembers.length) {
        await this.notifyModuleAssignments({
          module,
          staffMembers,
        })
      }
    }

    return this.success({ message: 'Operación completada con éxito.' })
  }

  @CatchServiceError()
  async getModuleMembers(payload: SimpleCondition<StaffModule>) {
    const { MODULE_ID, STATE = 'A' } = payload.condition

    const statement = `
        select s."NAME",
            s."LAST_NAME",
            s."STAFF_ID",
            s."EMAIL",
            s."PHONE",
            s."IDENTITY_DOCUMENT",
            sxm."MODULE_ID",
            sxm."STAFF_MODULE_ID",
            sxm."STATE"
        from public."STAFF_X_MODULE" sxm
        join public."STAFF" s
      on s."STAFF_ID" = sxm."STAFF_ID"
      where sxm."MODULE_ID" = $1
        and ( cast($2 as text) is null
          or sxm."STATE" = cast($2 as text) );
    `

    const data = await queryRunner<Staff>(statement, [MODULE_ID, STATE])

    if (!data.length) {
      return this.noContent()
    }

    return this.success({ data })
  }

  private async notifyModuleAssignments({
    module,
    staffMembers,
  }: {
    module: Module
    staffMembers: Staff[]
  }): Promise<void> {
    if (!staffMembers.length) {
      return
    }

    const supervisorStaff = module.SUPERVISOR?.STAFF
    const supervisorName = supervisorStaff
      ? `${supervisorStaff.NAME} ${supervisorStaff.LAST_NAME}`
      : 'No asignado'
    const supervisorEmail = supervisorStaff?.EMAIL ?? ''

    await Promise.all(
      staffMembers
        .filter((staff) => staff.EMAIL)
        .map((staff) =>
          publishEmailToQueue({
            to: staff.EMAIL,
            subject: 'Asignación a modulo',
            templateName: 'module',
            text: `Hola ${staff.NAME}, has sido asignado al modulo ${module.DESCRIPTION}.`,
            record: {
              staffName: `${staff.NAME} ${staff.LAST_NAME}`,
              staffEmail: staff.EMAIL,
              moduleName: module.DESCRIPTION,
              moduleId: module.MODULE_ID,
              supervisorName,
              supervisorEmail,
            },
          })
        )
    )
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
