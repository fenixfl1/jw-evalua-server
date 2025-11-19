import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalTask } from './GoalTask'
import { Staff } from './Staff'

@Entity({ name: 'GOAL_TASK_X_STAFF' })
export class GoalTaskStaff extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_TASK_STAFF_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: false })
  STAFF_ID: number

  @Column({ type: 'integer', nullable: false })
  TARGET: number

  @ManyToOne(() => GoalTask, (goalTask) => goalTask.STAFF, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'GOAL_TASK_ID' })
  TASK: GoalTask

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff
}
