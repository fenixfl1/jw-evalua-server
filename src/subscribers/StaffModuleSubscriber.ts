import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'
import { StaffModule } from '../entity/StaffXModule'
import { Staff } from '../entity/Staff'

@EventSubscriber()
export class StaffModuleSubscriber implements EntitySubscriberInterface<StaffModule> {
  constructor(dataSource: DataSource) {
    dataSource?.subscribers?.push?.(this)
  }

  listenTo() {
    return StaffModule
  }

  async afterInsert(event: InsertEvent<StaffModule>) {
    await this.syncStaffModule(event)
  }

  async afterUpdate(event: UpdateEvent<StaffModule>) {
    await this.syncStaffModule(event)
  }

  private async syncStaffModule(
    event: InsertEvent<StaffModule> | UpdateEvent<StaffModule>
  ) {
    const staffModule = await this.getCurrentStaffModule(event)
    if (!staffModule) {
      return
    }

    const staffId = staffModule.STAFF_ID
    if (!staffId) {
      return
    }

    const staffRepository = event.manager.getRepository(Staff)
    const staffModuleRepository = event.manager.getRepository(StaffModule)

    if (staffModule.STATE === 'A') {
      await staffRepository.update(
        { STAFF_ID: staffId },
        { MODULE_ID: staffModule.MODULE_ID }
      )
      return
    }

    const activeModule = await staffModuleRepository.findOne({
      where: {
        STAFF_ID: staffId,
        STATE: 'A',
      },
      order: {
        UPDATED_AT: 'DESC',
        CREATED_AT: 'DESC',
      },
    })

    await staffRepository.update(
      { STAFF_ID: staffId },
      { MODULE_ID: activeModule?.MODULE_ID ?? null }
    )
  }

  private async getCurrentStaffModule(
    event: InsertEvent<StaffModule> | UpdateEvent<StaffModule>
  ): Promise<StaffModule | null> {
    const currentEntity = event.entity as Partial<StaffModule> | undefined
    if (currentEntity && this.hasRequiredColumns(currentEntity)) {
      return currentEntity
    }

    const updateEvent = event as UpdateEvent<StaffModule>
    const candidateId =
      currentEntity?.STAFF_MODULE_ID ?? updateEvent.databaseEntity?.STAFF_MODULE_ID
    const repository = event.manager.getRepository(StaffModule)

    if (candidateId != null) {
      return repository.findOne({ where: { STAFF_MODULE_ID: candidateId } })
    }

    const candidateStaffId =
      currentEntity?.STAFF_ID ?? updateEvent.databaseEntity?.STAFF_ID
    if (candidateStaffId == null) {
      return null
    }

    return repository.findOne({
      where: { STAFF_ID: candidateStaffId },
      order: {
        UPDATED_AT: 'DESC',
        CREATED_AT: 'DESC',
      },
    })
  }

  private hasRequiredColumns(
    entity: Partial<StaffModule>
  ): entity is StaffModule {
    return (
      entity.STATE !== undefined &&
      entity.MODULE_ID !== undefined &&
      entity.STAFF_ID !== undefined
    )
  }
}
