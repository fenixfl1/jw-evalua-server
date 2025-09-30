import { FindOptionsWhere, Repository } from 'typeorm'
import { BaseService } from './base.service'
import { Staff } from '@src/entity/Staff'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  QueryParam,
  SessionInfo,
} from '@src/types/api.types'
import { BadRequestError, DbConflictError } from '@src/errors/http.error'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginate, paginatedQuery } from '@src/helpers/query-utils'
import { queryBuilder } from '@src/helpers/query-builder'
import {
  isValidDominicanIdentityDocument,
  normalizeIdentityDocument,
} from '@src/helpers/identity-document'

export class StaffService extends BaseService {
  async create(payload: Staff, session: SessionInfo) {
    const { EMAIL, IDENTITY_DOCUMENT } = payload

    if (await this.isFieldUsed('EMAIL', EMAIL)) {
      throw new DbConflictError(`El email: '${EMAIL}' ya esta en uso.`)
    }

    const normalizedIdentityDocument =
      normalizeIdentityDocument(IDENTITY_DOCUMENT)

    if (!isValidDominicanIdentityDocument(normalizedIdentityDocument)) {
      throw new BadRequestError(
        'La cedula ingresada no tiene un formato valido.'
      )
    }

    if (
      await this.isFieldUsed('IDENTITY_DOCUMENT', normalizedIdentityDocument)
    ) {
      throw new DbConflictError(
        `La cedula: '${IDENTITY_DOCUMENT}' ya esta registrada en el sistema.`
      )
    }

    const staff = this.staffRepository.create({
      ...payload,
      IDENTITY_DOCUMENT: normalizedIdentityDocument,
      STATE: 'A',
      CREATED_AT: new Date(),
      CREATED_BY: session?.userId,
    })

    await this.staffRepository.save(staff)

    return this.success({ message: 'Registro completado exitosamente.' })
  }

  async update(payload: Staff, session: SessionInfo): Promise<ApiResponse> {
    const { STAFF_ID, ...props } = payload
    const staff = await this.getStaff(STAFF_ID)

    const updateData: Partial<Staff> = {
      ...props,
      UPDATED_AT: new Date(),
      UPDATED_BY: session.userId,
    }

    if (
      typeof props.IDENTITY_DOCUMENT === 'string' &&
      props.IDENTITY_DOCUMENT
    ) {
      const normalizedIdentityDocument = normalizeIdentityDocument(
        props.IDENTITY_DOCUMENT
      )

      if (
        normalizedIdentityDocument !== staff.IDENTITY_DOCUMENT &&
        (await this.isFieldUsed(
          'IDENTITY_DOCUMENT',
          normalizedIdentityDocument
        ))
      ) {
        throw new DbConflictError(
          `La cedula: '${props.IDENTITY_DOCUMENT}' ya esta registrada en el sistema.`
        )
      }

      updateData.IDENTITY_DOCUMENT = normalizedIdentityDocument
    }

    await this.staffRepository.update({ STAFF_ID }, updateData)

    return this.success({
      data: { ...staff, ...updateData },
      message: 'Empleado actualizado con éxito',
    })
  }

  async getOneStaff(staffId: number): Promise<ApiResponse<Staff>> {
    const staff = await this.getStaff(staffId)

    return this.success({ data: staff })
  }

  async getPagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { values, whereClause } = whereClauseBuilder(payload)

    const statement = `
      select *
        from (
        select s.*,
                s."NAME"
                || ' '
                || s."LAST_NAME"
                || ' '
                || s."STAFF_ID"
                || s."IDENTITY_DOCUMENT"
                || ' '
                || s."EMAIL"
                || ' '
                || s."PHONE" as "FILTER",
                sxm."MODULE_ID" as "MODULE",
                u."USER_ID"
          from public."STAFF" s
          left join public."STAFF_X_MODULE" sxm
        on s."STAFF_ID" = sxm."STAFF_ID" AND sxm."STATE" = 'A'
          left join public."USERS" u
        on u."STAFF_ID" = s."STAFF_ID"
      ) subquery
      ${whereClause}
    `

    const [data = [], metadata] = await paginatedQuery<Staff>({
      statement,
      values,
      pagination,
    })

    if (!data.length) {
      return this.noContent()
    }

    return this.success({ data, metadata })
  }

  async validateIdentityDocument(identityDocument: string): Promise<
    ApiResponse<{
      identityDocument: string
      isValidFormat: boolean
      isInUse: boolean
    }>
  > {
    const normalizedDocument = normalizeIdentityDocument(identityDocument)
    const isValidFormat = isValidDominicanIdentityDocument(normalizedDocument)

    const isInUse = isValidFormat
      ? await this.isFieldUsed('IDENTITY_DOCUMENT', normalizedDocument)
      : false

    return this.success({
      data: {
        identityDocument: normalizedDocument,
        isValidFormat,
        isInUse,
      },
    })
  }
}
