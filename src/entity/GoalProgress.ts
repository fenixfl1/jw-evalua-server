import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Period } from './Period'

@Index('IDX_GOAL_PROGRESS_COMPOSITE', ['GOAL_ID', 'PERIOD_ID', 'MODULE_ID', 'STAFF_ID'])
@Entity('GOAL_PROGRESS')
export class GoalProgress extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_PROGRESS_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  // 'individual' | 'module'
  @Column({ type: 'enum', enum: ['individual', 'module'] })
  SCOPE: string

  // ISO week identifier (e.g., 202501 for 2025-W01)
  @Column({ type: 'integer' })
  PERIOD_ID: number

  @Column({ type: 'integer', nullable: true })
  STAFF_ID: number | null

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number | null

  // Actual produced/achieved value in the period
  @Column({ type: 'bigint' })
  ACTUAL_VALUE: number

  @ManyToOne(() => Period, { nullable: false })
  @JoinColumn({ name: 'PERIOD_ID' })
  PERIOD: Period
}
