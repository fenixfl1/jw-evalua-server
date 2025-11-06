import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalTask } from './GoalTask'

@Entity({ name: 'GOAL_TASK_X_STAFF' })
export class GoalTaskStaff extends BaseEntity {
  @PrimaryColumn({ type: 'integer' })
  GOAL_TASK_STAFF_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: false })
  TARGET: number

  @Column({ type: 'integer', nullable: false })
  STAFF_ID: number

  @ManyToOne(() => GoalTask, (goalTask) => goalTask.STAFF)
  @JoinColumn({ name: 'GOAL_TASK_ID' })
  TASK: GoalTask
}
