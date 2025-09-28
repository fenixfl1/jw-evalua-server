import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Evaluation } from './Evaluation'
import { Competency } from './Competency'
import { GoalStaff } from './GoalStaff'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Entity('EVALUATION_DETAIL')
@Unique('UQ_EVALUATION_DETAIL_UNIQUE', [
  'EVALUATION_ID',
  'COMPETENCY_ID',
  'GOAL_STAFF_ID',
])
export class EvaluationDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  EVALUATION_DETAIL_ID: number

  @Column({ type: 'integer' })
  EVALUATION_ID: number

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.DETAILS, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'EVALUATION_ID' })
  EVALUATION: Evaluation

  @Column({ type: 'integer' })
  COMPETENCY_ID: number

  @ManyToOne(() => Competency, (competency) => competency.EVALUATION_DETAILS, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'COMPETENCY_ID' })
  COMPETENCY: Competency

  @Column({ type: 'integer', nullable: true })
  GOAL_STAFF_ID: number | null

  @ManyToOne(() => GoalStaff, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'GOAL_STAFF_ID' })
  GOAL_ASSIGNMENT: GoalStaff | null

  @Column({ type: 'numeric', nullable: true, transformer: numericTransformer })
  WEIGHT?: number | null

  @Column({ type: 'numeric', nullable: true, transformer: numericTransformer })
  SCORE?: number | null

  @Column({ type: 'text', nullable: true })
  COMMENT?: string | null
}
