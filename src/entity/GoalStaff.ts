import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Goal } from './Goal'
import { Staff } from './Staff'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Entity('GOAL_X_STAFF')
export class GoalStaff extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_STAFF_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  @Column({ type: 'integer' })
  STAFF_ID: number

  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'numeric', transformer: numericTransformer })
  TARGET_VALUE: number

  @ManyToOne(() => Goal, (goal) => goal.STAFF)
  @JoinColumn({ name: 'GOAL_ID' })
  GOAL: Goal

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff

  @Column({ type: 'decimal' })
  WEIGHT: number
}
