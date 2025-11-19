import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalTask } from './GoalTask'
import { GoalProgress } from './GoalProgress'
import { Staff } from './Staff'

@Entity({ name: 'GOAL_TASK_COMPLETION' })
@Index('IDX_GOAL_TASK_COMPLETION_STAFF_DATE', ['STAFF_ID', 'RECORDED_AT'])
@Index('IDX_GOAL_TASK_COMPLETION_TASK_DATE', ['GOAL_TASK_ID', 'RECORDED_AT'])
@Index('IDX_GOAL_TASK_COMPLETION_STAFF_TASK', ['STAFF_ID', 'GOAL_TASK_ID'])
export class GoalTaskCompletion extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_TASK_COMPLETION_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: true })
  GOAL_TASK_STAFF_ID: number | null

  @Column({ type: 'integer', nullable: false })
  GOAL_PROGRESS_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_ID: number

  @Column({ type: 'integer', nullable: true })
  GOAL_MODULE_ID: number | null

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number | null

  @Column({ type: 'integer', nullable: true })
  PERIOD: number | null

  @Column({ type: 'integer', nullable: false })
  STAFF_ID: number

  @Column({ type: 'integer', nullable: false, default: 1 })
  UNITS: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  RECORDED_AT: Date

  @Column({ type: 'jsonb', nullable: true })
  METADATA: Record<string, any> | null

  @ManyToOne(() => GoalTask)
  @JoinColumn({ name: 'GOAL_TASK_ID' })
  TASK: GoalTask

  @ManyToOne(() => GoalProgress)
  @JoinColumn({ name: 'GOAL_PROGRESS_ID' })
  PROGRESS: GoalProgress

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff
}
