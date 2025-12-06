import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalStaff } from './GoalStaff'
import { GoalModule } from './GoalModule'
import { GoalScope } from './goal-scope.enum'
import { GoalTask } from './GoalTask'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

export interface GoalTaskTemplate {
  DESCRIPTION: string
  COMMENT: string | null
  TARGET: number
  UNITS_PER_ITEM: number
}

@Entity('GOAL')
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_ID: number

  @Column({ type: 'varchar' })
  DESCRIPTION: string

  @Column({ type: 'date' })
  START_DATE: Date

  @Column({ type: 'date' })
  END_DATE: Date

  @Column({
    type: 'numeric',
    nullable: false,
    default: 0,
    transformer: numericTransformer,
  })
  TARGET_VALUE: number

  @Column({ type: 'integer' })
  WEIGHT: number

  @Column({ name: 'SCOPE', type: 'enum', enum: GoalScope })
  SCOPE: GoalScope

  @Column({
    type: 'jsonb',
    nullable: true,
    default: () => "'[]'::jsonb",
  })
  TASK_TEMPLATES: GoalTaskTemplate[]

  @OneToMany(() => GoalStaff, (goalStaff) => goalStaff.GOAL)
  STAFF: GoalStaff[]

  @OneToMany(() => GoalModule, (goalModule) => goalModule.GOAL)
  MODULES: GoalModule[]

  @OneToMany(() => GoalTask, (goalTask) => goalTask.GOAL)
  TASKS: GoalTask[]
}
