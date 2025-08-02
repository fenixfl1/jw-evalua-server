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
  }

  async update(payload: Staff): Promise<ApiResponse> {
    return this.success({})
  }

  async getPagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { qb, parameters } = queryBuilder(
      this.staffRepository.createQueryBuilder('STAFF'),
      payload,
      'STAFF'
    )

    const params = []
    Object.entries(parameters).forEach(([, value]) => {
      params.push(value)
    })

    const { data, metadata } = await paginate<Staff>(qb, pagination)

    return this.success({ data, metadata })
  }
}
