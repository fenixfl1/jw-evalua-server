import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Goal } from './Goal'
import { Module } from './Module'
import { GoalDailyTarget } from './GoalDailyTarget'
import { GoalProgress } from './GoalProgress'
import { GoalTask } from './GoalTask'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Entity('GOAL_X_MODULE')
export class GoalModule extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_MODULE_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @ManyToOne(() => Goal, (goal) => goal.MODULES)
  @JoinColumn({ name: 'GOAL_ID' })
  GOAL: Goal

  @ManyToOne(() => Module)
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module

  // ISO week identifier (e.g., 202501 for 2025-W01)
  @Column({ type: 'integer', nullable: true })
  PERIOD: number

  // Target units for the module in the period
  @Column({ type: 'numeric', nullable: true, transformer: numericTransformer })
  TARGET_VALUE: number

  @OneToMany(() => GoalProgress, (progress) => progress.GOAL_MODULE)
  PROGRESS: GoalProgress[]

  @OneToMany(() => GoalDailyTarget, (dailyTarget) => dailyTarget.GOAL_MODULE)
  DAILY_TARGETS: GoalDailyTarget[]

  @OneToMany(() => GoalTask, (task) => task.GOAL_MODULE)
  TASKS: GoalTask[]
}
