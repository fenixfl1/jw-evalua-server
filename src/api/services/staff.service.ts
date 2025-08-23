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
import { DbConflictError } from '@src/errors/http.error'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginate, paginatedQuery } from '@src/helpers/query-utils'
import { queryBuilder } from '@src/helpers/query-builder'

export class StaffService extends BaseService {
  async create(payload: Staff, session: SessionInfo) {
    try {
      const { EMAIL, IDENTITY_DOCUMENT } = payload

      if (await this.isFieldUsed('EMAIL', EMAIL)) {
        throw new DbConflictError(`El email: '${EMAIL}' ya esta en uso.`)
      }

      if (await this.isFieldUsed('IDENTITY_DOCUMENT', IDENTITY_DOCUMENT)) {
        throw new DbConflictError(
          `La cédula: '${IDENTITY_DOCUMENT}' ya esta registrada en el sistema.`
        )
      }

      const staff = this.staffRepository.create({
        ...payload,
        STATE: 'A',
        CREATED_AT: new Date(),
        CREATED_BY: session?.userId,
      })

      await this.staffRepository.save(staff)

      return this.success({ message: 'Registro completado exitosamente.' })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log({ error })
      throw error
    }
  }

  async update(payload: Staff): Promise<ApiResponse> {
    return this.success({})
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
                (
                  case
                      when exists (
                        select 1
                          from public."USERS" u
                          where u."STAFF_ID" = s."STAFF_ID"
                      ) then
                        'S'
                      else
                        'N'
                  end
                ) "HAS_USER",
                s."NAME"
                || ' '
                || s."LAST_NAME"
                || ' '
                || s."STAFF_ID"
                || s."IDENTITY_DOCUMENT"
                || ' '
                || s."EMAIL"
                || ' '
                || s."PHONE" "FILTER"
          from public."STAFF" s
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
}
