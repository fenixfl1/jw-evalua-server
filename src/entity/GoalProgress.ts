import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Goal } from './Goal'
import { GoalScope } from './goal-scope.enum'
import { Staff } from './Staff'
import { Module } from './Module'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Index('IDX_GOAL_PROGRESS_COMPOSITE', [
  'GOAL_ID',
  'PERIOD',
  'MODULE_ID',
  'STAFF_ID',
])
@Entity('GOAL_PROGRESS')
export class GoalProgress extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_PROGRESS_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  @ManyToOne(() => Goal, (goal) => goal.PROGRESS)
  @JoinColumn({ name: 'GOAL_ID' })
  GOAL: Goal

  @Column({ type: 'enum', enum: GoalScope })
  SCOPE: GoalScope

  // ISO week identifier (e.g., 202501 for 2025-W01)
  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'integer', nullable: true })
  STAFF_ID: number | null

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff | null

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number | null

  @ManyToOne(() => Module, { nullable: true })
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module | null

  // Actual produced/achieved value in the period
  @Column({ type: 'numeric', transformer: numericTransformer })
  ACTUAL_VALUE: number
}
