import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalScope } from './goal-scope.enum'
import { Staff } from './Staff'
import { GoalModule } from './GoalModule'

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

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number | null

  @Column({ type: 'integer', nullable: true })
  GOAL_MODULE_ID: number | null

  @ManyToOne(() => GoalModule, (gm) => gm.PROGRESS, { nullable: true })
  @JoinColumn({ name: 'GOAL_MODULE_ID' })
  GOAL_MODULE: GoalModule | null

  @Column({ type: 'enum', enum: GoalScope })
  SCOPE: GoalScope

  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'integer', nullable: true })
  STAFF_ID: number | null

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff | null

  @Column({ type: 'numeric', transformer: numericTransformer })
  ACTUAL_VALUE: number
}
