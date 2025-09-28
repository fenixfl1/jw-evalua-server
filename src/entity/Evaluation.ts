import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Module } from './Module'
import { Staff } from './Staff'
import { EvaluationDetail } from './EvaluationDetail'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Entity('EVALUATION')
@Index('IDX_EVALUATION_LOOKUP', ['MODULE_ID', 'STAFF_ID', 'PERIOD'])
export class Evaluation extends BaseEntity {
  @PrimaryGeneratedColumn()
  EVALUATION_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @ManyToOne(() => Module, (module) => module.EVALUATIONS, { nullable: false })
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module

  @Column({ type: 'integer' })
  STAFF_ID: number

  @ManyToOne(() => Staff, (staff) => staff.EVALUATIONS_RECEIVED, {
    nullable: false,
  })
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff

  @Column({ type: 'integer', nullable: true })
  EVALUATOR_ID: number | null

  @ManyToOne(() => Staff, (staff) => staff.EVALUATIONS_GIVEN, {
    nullable: true,
  })
  @JoinColumn({ name: 'EVALUATOR_ID' })
  EVALUATOR: Staff | null

  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'numeric', nullable: true, transformer: numericTransformer })
  OVERALL_SCORE?: number | null

  @Column({ type: 'text', nullable: true })
  COMMENTS?: string | null

  @OneToMany(() => EvaluationDetail, (detail) => detail.EVALUATION)
  DETAILS: EvaluationDetail[]
}
