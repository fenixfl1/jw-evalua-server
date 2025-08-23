import { asyncLocalStorage } from '../api/middlewares/storage.middleware'
import { ActivityLog } from '../entity/ActivityLog'
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm'

@EventSubscriber()
export class GlobalActivitySubscriber implements EntitySubscriberInterface {
  /**
   * Se llama en cualquier inserción
   */
  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.name === 'ActivityLog') return // Evitar loop

    if (this.getUserId()) {
      const log = new ActivityLog()
      log.USER_ID = this.getUserId()
      log.ACTION = 'INSERT'
      log.MODEL = event.metadata.name
      log.OBJECT_ID = this.getEntityId(event)
      log.CHANGES = event.entity

      await event.manager.getRepository(ActivityLog).save(log)
    }
  }

  /**
   * Se llama en cualquier actualización
   */
  async afterUpdate(event: UpdateEvent<any>) {
    if (event.metadata.name === 'ActivityLog') return

    if (this.getUserId()) {
      const log = new ActivityLog()
      log.USER_ID = this.getUserId()
      log.ACTION = 'UPDATE'
      log.MODEL = event.metadata.name
      log.OBJECT_ID = this.getEntityId(event)
      log.CHANGES = event.updatedColumns.reduce((changes, col) => {
        changes[col.propertyName] = (event.entity as any)[col.propertyName]
        return changes
      }, {} as Record<string, any>)

      await event.manager.getRepository(ActivityLog).save(log)
    }
  }

  /**
   * Se llama en cualquier eliminación
   */
  async afterRemove(event: RemoveEvent<any>) {
    if (event.metadata.name === 'ActivityLog') return

    if (this.getUserId()) {
      const log = new ActivityLog()
      log.USER_ID = this.getUserId()
      log.ACTION = 'DELETE'
      log.MODEL = event.metadata.name
      log.OBJECT_ID = this.getEntityId(event)
      log.CHANGES = event.entity ?? null

      await event.manager.getRepository(ActivityLog).save(log)
    }
  }

  /**
   * Método auxiliar: obtener el ID del usuario actual.
   * Esto depende de cómo pases el usuario en el contexto de la request.
   */
  private getUserId(): number {
    const storage = asyncLocalStorage.getStore()

    return storage?.userId
  }

  private getEntityId(event: any) {
    const primaryColumns = event.metadata.primaryColumns

    if (!primaryColumns || primaryColumns.length === 0) {
      return null
    }

    // Si hay una sola clave primaria
    if (primaryColumns.length === 1) {
      const primaryColumn = primaryColumns[0]
      return (
        event.entity?.[primaryColumn.propertyName] ??
        event.databaseEntity?.[primaryColumn.propertyName]
      )
    }

    // Si hay múltiples claves primarias (composite key)
    const id: Record<string, any> = {}
    for (const column of primaryColumns) {
      id[column.propertyName] =
        event.entity?.[column.propertyName] ??
        event.databaseEntity?.[column.propertyName]
    }
    return id
  }
}
