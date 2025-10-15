import { EntityManager, In, Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Role } from '@src/entity/Role'
import {
  AdvancedCondition,
  ApiResponse,
  Pagination,
  SessionInfo,
} from '@src/types/api.types'
import { NotFoundError } from '@src/errors/http.error'
import { MenuOption } from '@src/entity/MenuOption'
import { User } from '@src/entity/User'
import { whereClauseBuilder } from '@src/helpers/where-clause-builder'
import { paginatedQuery } from '@src/helpers/query-utils'
import { PermissionRole } from '@src/entity/PermissionRole'

interface PermissionPayload {
  ROLE: Role
  MENU_OPTIONS: string[]
  CREATOR: User
}

interface CreateRolePayload extends Role {
  PERMISSIONS: number[]
}

export class RoleService extends BaseService {
  private roleRepository: Repository<Role>
  private menuOptionRepository: Repository<MenuOption>
  private permissionRoleRepository: Repository<PermissionRole>

  constructor() {
    super()
    this.roleRepository = this.dataSource.getRepository(Role)
    this.permissionRoleRepository =
      this.dataSource.getRepository(PermissionRole)
  }

  @CatchServiceError()
  async create(
    payload: CreateRolePayload,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { PERMISSIONS, ...restProps } = payload
    return this.dataSource.transaction(async (manager) => {
      const user = await this.getUser(session.username)

      const common = {
        CREATED_AT: new Date(),
        CREATOR: user,
        STATE: 'A',
      }

      const role = this.roleRepository.create({
        ...restProps,
        ...common,
      })

      const newRole = await manager.save(role)

      const permissions: PermissionRole[] = []
      for (const perm of PERMISSIONS) {
        const permission = this.permissionRoleRepository.create({
          ...common,
          PERMISSION_ID: perm,
          ROLE_ID: newRole.ROLE_ID,
        })

        permissions.push(permission)
      }

      await manager.save(permissions)

      return this.success({ message: 'Rol creado exitosamente.' })
    })
  }

  @CatchServiceError()
  async update(
    payload: { ROLE_ID: number; PERMISSIONS?: number[] } & Partial<Role>,
    session: SessionInfo
  ): Promise<ApiResponse> {
    const { ROLE_ID, PERMISSIONS, ...restProps } = payload

    return this.dataSource.transaction(async (manager) => {
      const user = await this.getUser(session.username)

      // 1) Verificar que el rol exista
      const role = await manager.getRepository(Role).findOneBy({ ROLE_ID })
      if (!role) throw new NotFoundError(`Rol con id '${ROLE_ID}' no existe.`)

      // 2) Actualizar datos del rol (nombre, descripción, etc.)
      if (Object.keys(restProps).length) {
        await manager.getRepository(Role).update({ ROLE_ID }, { ...restProps })
      }

      // 3) Sincronizar permisos solo si viene la lista (permite "no tocar" si es undefined)
      if (Array.isArray(PERMISSIONS)) {
        const prRepo = manager.getRepository(PermissionRole)

        // Traer estado actual
        const existing = await prRepo.find({
          where: { ROLE_ID }, // si usas relación: where: { ROLE: { ROLE_ID } as any }
          select: { PERMISSION_ID: true, STATE: true },
        })

        const incoming = new Set(PERMISSIONS) // dedupe
        const byPermId = new Map(existing.map((e) => [e.PERMISSION_ID, e]))

        const toActivate: number[] = []
        const toDeactivate: number[] = []
        const toCreate: PermissionRole[] = []

        // decidir activaciones/desactivaciones
        for (const row of existing) {
          const isInPayload = incoming.has(row.PERMISSION_ID)
          if (isInPayload) {
            if (row.STATE !== 'A') toActivate.push(row.PERMISSION_ID)
          } else {
            if (row.STATE === 'A') toDeactivate.push(row.PERMISSION_ID)
          }
        }

        // decidir creaciones
        for (const permId of incoming) {
          if (!byPermId.has(permId)) {
            toCreate.push(
              prRepo.create({
                ROLE_ID, // si usas relación: ROLE: { ROLE_ID } as any
                PERMISSION_ID: permId,
                STATE: 'A',
                CREATED_AT: new Date(),
                CREATED_BY: user.USER_ID,
              })
            )
          }
        }

        // ejecutar cambios (nota: estas actualizaciones NO disparan subscribers)
        if (toActivate.length) {
          await prRepo
            .createQueryBuilder()
            .update()
            .set({ STATE: 'A', UPDATED_AT: new Date() })
            .where('ROLE_ID = :ROLE_ID', { ROLE_ID })
            .andWhere('PERMISSION_ID IN (:...ids)', { ids: toActivate })
            .execute()
        }

        if (toDeactivate.length) {
          await prRepo
            .createQueryBuilder()
            .update()
            .set({ STATE: 'I', UPDATED_AT: new Date() })
            .where('ROLE_ID = :ROLE_ID', { ROLE_ID })
            .andWhere('PERMISSION_ID IN (:...ids)', { ids: toDeactivate })
            .execute()
        }

        if (toCreate.length) {
          await prRepo.insert(toCreate) // bulk insert
        }
      }

      return this.success({ message: 'Rol actualizado exitosamente.' })
    })
  }

  @CatchServiceError()
  async permissions(
    payload: PermissionPayload,
    manager: EntityManager
  ): Promise<unknown> {
    const { ROLE, CREATOR, MENU_OPTIONS = [] } = payload

    const menuOptRoles = []

    if (MENU_OPTIONS?.length) {
      const options = await this.menuOptionRepository.find({
        where: {
          MENU_OPTION_ID: In(MENU_OPTIONS),
        },
      })

      for (const option of options) {
        menuOptRoles.push({
          MENU_OPTION: option,
          ROLE,
          CREATED_AT: new Date(),
          STATE: 'A',
          CREATOR,
        })
      }
    }

    await manager.save(menuOptRoles)

    return
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
        r.*,
        s."NAME" || ' ' || s."LAST_NAME" AS "CREATOR"
      FROM 
        public."ROLE" r
        LEFT JOIN public."USERS" u ON  u."USER_ID" = r."CREATED_BY"
        LEFT JOIN public."STAFF" s ON s."STAFF_ID" = u."STAFF_ID"
      ) AS subquery
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
  public async getOne(roleId: number): Promise<ApiResponse> {
    const role = await this.roleRepository.findOne({
      where: {
        ROLE_ID: roleId,
      },
    })

    if (!role) {
      throw new NotFoundError(`Rol con id '${roleId}' no encontrado.`)
    }

    const permissions = await this.permissionRoleRepository.find({
      select: ['PERMISSION_ID'],
      where: {
        ROLE_ID: roleId,
        STATE: 'A',
      },
    })

    const data = {
      ...role,
      PERMISSIONS: permissions.map((perm) => perm.PERMISSION_ID),
    }

    return this.success({ data })
  }
}
