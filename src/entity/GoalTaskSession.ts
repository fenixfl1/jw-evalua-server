import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalTask } from './GoalTask'
import { Staff } from './Staff'

@Entity({ name: 'GOAL_TASK_SESSION' })
@Index('IDX_SESSION_ACTIVE', ['GOAL_TASK_ID', 'STAFF_ID', 'IS_ACTIVE'])
export class GoalTaskSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_TASK_SESSION_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: true })
  GOAL_MODULE_ID: number | null

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number | null

  @Column({ type: 'integer', nullable: true })
  PERIOD: number | null

  @Column({ type: 'integer', nullable: false })
  STAFF_ID: number

  @Column({ type: 'timestamp', nullable: false })
  STARTED_AT: Date

  @Column({ type: 'timestamp', nullable: true })
  ENDED_AT: Date | null

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value?: number | null) => value ?? 0,
      from: (value: unknown) =>
        value === null || value === undefined ? 0 : Number(value),
    },
  })
  ACCUMULATED_SECONDS: number

  @Column({ type: 'timestamp', nullable: true })
  LAST_RESUMED_AT: Date | null

  @Column({ type: 'boolean', default: true })
  IS_ACTIVE: boolean

  @ManyToOne(() => GoalTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'GOAL_TASK_ID' })
  TASK: GoalTask

  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff
}
