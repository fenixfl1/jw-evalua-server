import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalModule } from './GoalModule'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Index(
  'IDX_GOAL_DAILY_TARGET_UNIQUE',
  ['GOAL_MODULE_ID', 'PERIOD', 'TARGET_DATE'],
  {
    unique: true,
  }
)
@Entity('GOAL_DAILY_TARGET')
export class GoalDailyTarget extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_DAILY_TARGET_ID: number

  @Column({ type: 'integer' })
  GOAL_MODULE_ID: number

  @ManyToOne(() => GoalModule, (gm) => gm.DAILY_TARGETS)
  @JoinColumn({ name: 'GOAL_MODULE_ID' })
  GOAL_MODULE: GoalModule

  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'date' })
  TARGET_DATE: string

  @Column({ type: 'numeric', transformer: numericTransformer })
  TARGET_VALUE: number

  @Column({
    type: 'numeric',
    transformer: numericTransformer,
    nullable: true,
  })
  TARGET_TIME: number | null
}
