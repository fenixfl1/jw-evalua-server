import { User } from '@src/entity/User'
import { BaseService } from './base.service'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { generatePassword } from '@src/helpers/generate-password'
import * as bcrypt from 'bcrypt'
import { DbConflictError } from '@src/errors/http.error'
import { publishEmailToQueue } from './email/email-producer.service'
import { UserRoles } from '@src/entity/RolesUser'
import { EntityManager, Repository } from 'typeorm'
import { Staff } from '@src/entity/Staff'
import { Role } from '@src/entity/Role'
import { queryBuilder } from '@src/helpers/query-builder'
import { paginate, paginatedQuery, queryRunner } from '@src/helpers/query-utils'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { HTTP_STATUS_NO_CONTENT } from '@src/constants/status-codes'

interface CreateUserPayload extends User {
  STAFF_ID: number
  ROLE_ID: number
}

export class UserService extends BaseService {
  userRolesRepository: Repository<UserRoles>
  roleRepository: Repository<Role>

  constructor() {
    super()
    this.userRolesRepository = this.dataSource.getRepository(UserRoles)
    this.roleRepository = this.dataSource.getRepository(Role)
  }

  async create(payload: CreateUserPayload, session: SessionInfo) {
    const {
      USERNAME,
      PASSWORD = '1234',
      STAFF_ID,
      ROLE_ID,
      ...userData
    } = payload

    return this.dataSource.transaction(async (manager) => {
      const staff = await this.getStaff(STAFF_ID)

      if (await this.isFieldUsed('USERNAME', USERNAME)) {
        throw new DbConflictError(
          `El nombre de usuario: '${USERNAME}' ya esta en uso.`
        )
      }

      const password = PASSWORD ?? generatePassword()
      const hashedPassword = await bcrypt.hash(password, 10)

      const creator = await this.userRepository.findOneBy({
        USER_ID: session.userId,
      })

      const data = this.userRepository.create({
        ...userData,
        STAFF: staff,
        CREATED_AT: new Date(),
        IS_ACTIVE: true,
        CREATOR: creator,
        PASSWORD: hashedPassword,
        USERNAME,
      })

      const user = await manager.save(data)

      if (ROLE_ID) {
        await this.createUserRole(
          { USER: user, ROLE_ID, CREATOR: creator },
          manager
        )
      }

      try {
        await publishEmailToQueue({
          to: staff.EMAIL,
          subject: 'Te damos la bienvenida',
          templateName: 'welcome',
          record: {
            ...staff,
            USERNAME,
            password,
            url: process.env.ADMIN_APP_URL,
          },
          text: '',
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({ error })
      }

      return this.success({ message: 'Usuario registrado exitosamente' })
    })
  }

  async createUserRole(
    payload: Pick<UserRoles, 'ROLE_ID' | 'CREATOR' | 'USER'>,
    manager: EntityManager
  ): Promise<UserRoles> {
    const [role] = await this.roleRepository.find({
      where: { ROLE_ID: payload.ROLE_ID },
    })

    const data = this.userRolesRepository.create({
      ROLE: role,
      USER: payload.USER,
      CREATED_AT: new Date(),
    })

    const userRole = await manager.save(data)

    // eslint-disable-next-line no-console
    console.log({ userRole })

    return userRole
  }

  async getPagination(
    payload: AdvancedCondition[],
    pagination: Pagination
  ): Promise<ApiResponse> {
    const { values, whereClause } = whereClauseBuilder(payload)

    const statement = `
      SELECT 
        *
      FROM  (
        SELECT 
        U."USERNAME",
        U."USER_ID",
        U."IS_ACTIVE",
        U."AVATAR",
        U."STATE",
        S."NAME",
        S."LAST_NAME",
        S."EMAIL",
        S."PHONE",
        STRING_AGG(R."NAME", ', ') AS "ROLES",
        S."NAME" || ' ' || S."LAST_NAME" || ' ' || U."USERNAME"  || ' ' || S."PHONE" AS "FILTER"
      FROM  
        public."USERS" AS U
        LEFT JOIN public."STAFF" AS S ON S."STAFF_ID" = U."STAFF_ID"
        LEFT JOIN public."ROLES_X_USER" AS RXU ON RXU."USER_ID" = U."USER_ID"
        LEFT JOIN public."ROLE" AS R ON R."ROLE_ID" = RXU."ROLE_ID"
      GROUP BY 
        U."USERNAME", U."USER_ID", U."IS_ACTIVE", U."AVATAR", U."STATE",
        S."NAME", S."LAST_NAME", S."EMAIL", S."PHONE"
      ) AS SUBQUERY
      ${whereClause}
        
      `

    const [data = [], metadata] = await paginatedQuery({
      statement,
      values,
      pagination,
    })

    if (!data.length) {
      return this.success({ status: HTTP_STATUS_NO_CONTENT })
    }

    return this.success({ data, metadata })
  }
}
