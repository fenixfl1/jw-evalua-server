import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'
import { GoalStaff } from '../entity/GoalStaff'
import { GoalModule } from '../entity/GoalModule'
import { Goal } from '../entity/Goal'
import { GoalScope } from '../entity/goal-scope.enum'

@EventSubscriber()
export class GoalScopeSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource?.subscribers?.push?.(this)
  }

  listenTo() {
    return Object
  }

  async beforeInsert(event: InsertEvent<any>) {
    await this.validateScope(event)
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    await this.validateScope(event)
  }

  private async validateScope(event: InsertEvent<any> | UpdateEvent<any>) {
    const entity: any = event.entity
    if (!entity) return
    const manager = event.manager

    // GoalStaff must reference individual goals
    if (
      entity instanceof GoalStaff ||
      (entity.constructor && entity.constructor.name === 'GoalStaff')
    ) {
      const goal = await manager
        .getRepository(Goal)
        .findOne({ where: { GOAL_ID: entity.GOAL_ID } })
      if (goal && goal.SCOPE !== GoalScope.INDIVIDUAL) {
        throw new Error('GOAL_X_STAFF requires goal with SCOPE = individual')
      }
    }

    // GoalModule must reference module goals
    if (
      entity instanceof GoalModule ||
      (entity.constructor && entity.constructor.name === 'GoalModule')
    ) {
      const goal = await manager
        .getRepository(Goal)
        .findOne({ where: { GOAL_ID: entity.GOAL_ID } })
      if (goal && goal.SCOPE !== GoalScope.MODULE) {
        throw new Error('GOAL_X_MODULE requires goal with SCOPE = module')
      }
    }
  }
}
