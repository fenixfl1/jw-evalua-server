import { User } from '@src/entity/User'
import { BaseService, CatchServiceError } from './base.service'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { generatePassword } from '@src/helpers/generate-password'
import * as bcrypt from 'bcrypt'
import {
  DbConflictError,
  NotFoundError,
  UnAuthorizedError,
} from '@src/errors/http.error'
import { publishEmailToQueue } from './email/email-producer.service'
import { UserRoles } from '@src/entity/RolesUser'
import { EntityManager, Repository } from 'typeorm'
import { Role } from '@src/entity/Role'
import { paginatedQuery, queryRunner } from '@src/helpers/query-utils'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'

interface CreateUserPayload extends User {
  STAFF_ID: number
  ROLE_ID: number
  PASSWORD?: string
}

interface UpdateUserPayload extends User {
  ROLE_ID: number
}

interface ChangePasswordPayload {
  OLD_PASSWORD: string
  NEW_PASSWORD: string
  USERNAME: string
}

export class UserService extends BaseService {
  private userRolesRepository: Repository<UserRoles>
  private roleRepository: Repository<Role>

  constructor() {
    super()
    this.userRolesRepository = this.dataSource.getRepository(UserRoles)
    this.roleRepository = this.dataSource.getRepository(Role)
  }

  async create(payload: CreateUserPayload, session: SessionInfo) {
    const {
      USERNAME,
      PASSWORD: RAW_PASSWORD = '1234',
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

      const { password, hash } = await generatePassword(RAW_PASSWORD)

      const creator = await this.userRepository.findOneBy({
        USER_ID: session.userId,
      })

      const data = this.userRepository.create({
        ...userData,
        STAFF: staff,
        CREATED_AT: new Date(),
        IS_ACTIVE: true,
        CREATOR: creator,
        PASSWORD_HASH: hash,
        USERNAME,
      })

      const user = await manager.save(data)

      if (ROLE_ID) {
        await this.createUserRole(
          { USER: user, ROLE_ID, CREATED_BY: creator.USER_ID },
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
            url: process.env.APP_URL,
          },
          text: '',
        })
      } catch (error) {
        console.error({ error })
      }

      return this.success({ message: 'Usuario registrado exitosamente' })
    })
  }

  @CatchServiceError()
  async update(
    payload: UpdateUserPayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { USERNAME, USER_ID, ROLE_ID, ...restProps } = payload

    return this.dataSource.transaction(async (manager) => {
      const [user] = await this.userRepository.find({
        relations: ['ROLES'],
        where: { USERNAME, USER_ID },
      })

      if (Object.keys(restProps ?? {}).length) {
        await manager.update(User, { USERNAME, USER_ID }, { ...restProps })
      }

      const userRoles = await this.userRolesRepository.find({
        where: {
          USER_ID,
        },
      })

      if (
        ROLE_ID &&
        !userRoles.some(
          (rol) => rol.ROLE_ID === ROLE_ID && rol.USER_ID === USER_ID
        )
      ) {
        await manager.update(UserRoles, { USER_ID }, { STATE: 'I' })

        await manager.save(UserRoles, {
          ROLE_ID,
          USER: user,
          CREATED_AT: new Date(),
          CREATED_BY: session.userId,
          STATE: 'A',
        })
      }

      const { data } = await this.getOneUer(USERNAME)

      return this.success({ data })
    })
  }

  @CatchServiceError()
  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse> {
    const { USERNAME, OLD_PASSWORD, NEW_PASSWORD } = payload
    const user = await this.userRepository.findOne({
      where: { USERNAME },
      select: {
        USER_ID: true,
        USERNAME: true,
        PASSWORD_HASH: true,
      },
    })

    if (!user) {
      throw new NotFoundError('Usuario no encontrado.')
    }

    if (!(await bcrypt.compare(OLD_PASSWORD, user.PASSWORD_HASH))) {
      throw new UnAuthorizedError('La contraseña actual no es correcta.')
    }

    const { hash } = await generatePassword(NEW_PASSWORD)
    await this.userRepository.save({ ...user, PASSWORD_HASH: hash })

    return this.success({ message: 'Contraseña actualizada con  éxito.' })
  }

  @CatchServiceError()
  async createUserRole(
    payload: Pick<UserRoles, 'ROLE_ID' | 'CREATED_BY' | 'USER'>,
    manager: EntityManager
  ): Promise<UserRoles> {
    try {
      const [role] = await this.roleRepository.find({
        where: { ROLE_ID: payload.ROLE_ID },
      })

      const data = this.userRolesRepository.create({
        ROLE: role,
        USER: payload.USER,
        CREATED_BY: payload.CREATED_BY,
        CREATED_AT: new Date(),
      })

      const userRole = await manager.save(UserRoles, data)

      return userRole
    } catch (error) {
      throw error
    }
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
        U."CREATED_AT",
        C."NAME" || ' ' || C."LAST_NAME" as "CREATED_BY",
        S."NAME",
        S."LAST_NAME",
        S."EMAIL",
        S."PHONE",
        S."STAFF_ID",
        S."ADDRESS",
        STRING_AGG(RXU."ROLE_ID"::TEXT, ', ') "ROLE_ID",
        STRING_AGG(R."NAME", ', ') "ROLES",
        S."NAME" || ' ' || S."LAST_NAME" || ' ' || U."USERNAME"  || ' ' || S."PHONE" AS "FILTER"
      FROM  
        public."USERS" U
        LEFT JOIN public."STAFF" S ON S."STAFF_ID" = U."STAFF_ID"
        LEFT JOIN public."ROLES_X_USER" RXU ON RXU."USER_ID" = U."USER_ID" AND RXU."STATE" = 'A'
        LEFT JOIN public."ROLE" R ON R."ROLE_ID" = RXU."ROLE_ID"
        LEFT JOIN public."STAFF" c ON c."STAFF_ID" = U."CREATED_BY"
      GROUP BY 
        U."USERNAME", U."USER_ID", U."IS_ACTIVE", U."AVATAR", U."STATE",
        S."NAME", S."LAST_NAME", S."EMAIL", S."PHONE",S."STAFF_ID", S."ADDRESS",
        C."NAME", C."LAST_NAME"
      ) SUBQUERY
      ${whereClause}
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
  async getOneUer(username: string): Promise<ApiResponse<User>> {
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
        S."ADDRESS",
        S."IDENTITY_DOCUMENT",
        S."BIRTH_DATE",
        S."CREATED_AT",
        STRING_AGG(R."NAME", ', ') "ROLES"
      FROM  
        public."USERS" U
        LEFT JOIN public."STAFF" S ON S."STAFF_ID" = U."STAFF_ID"
        LEFT JOIN public."ROLES_X_USER" RXU ON RXU."USER_ID" = U."USER_ID" AND RXU."STATE" = 'A'
        LEFT JOIN public."ROLE" R ON R."ROLE_ID" = RXU."ROLE_ID"
      GROUP BY 
        U."USERNAME", U."USER_ID", U."IS_ACTIVE", U."AVATAR", U."STATE",
        S."NAME", S."LAST_NAME", S."EMAIL", S."PHONE",
         S."IDENTITY_DOCUMENT", S."BIRTH_DATE", S."CREATED_AT", S."ADDRESS"
      ) AS SUBQUERY
    WHERE
      "USERNAME" = $1
    `

    const data = await queryRunner<User>(statement, [username])

    if (!data?.length) {
      throw new NotFoundError('Usuario no encontrado.')
    }

    return this.success({ data: data[0] })
  }
}
