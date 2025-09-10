import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Period } from './Period'

@Entity('GOAL_X_MODULE')
export class GoalModule extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_MODULE_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  // ISO week identifier (e.g., 202501 for 2025-W01)
  @Column({ type: 'integer', nullable: true })
  PERIOD_ID: number

  // Target units for the module in the period
  @Column({ type: 'bigint', nullable: true })
  TARGET_VALUE: number

  @ManyToOne(() => Period, { nullable: false })
  @JoinColumn({ name: 'PERIOD_ID' })
  PERIOD: Period
}
