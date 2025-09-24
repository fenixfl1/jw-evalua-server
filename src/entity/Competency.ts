import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { EvaluationDetail } from './EvaluationDetail'

const numericTransformer = {
  to: (value?: number | null) => value,
  from: (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return null
    return typeof value === 'string' ? Number(value) : value
  },
}

@Entity('COMPETENCY')
@Unique('UQ_COMPETENCY_NAME', ['NAME'])
export class Competency extends BaseEntity {
  @PrimaryGeneratedColumn()
  COMPETENCY_ID: number

  @Column({ type: 'varchar', length: 150 })
  NAME: string

  @Column({ type: 'text', nullable: true })
  DESCRIPTION?: string | null

  @Column({ type: 'numeric', nullable: true, transformer: numericTransformer })
  WEIGHT?: number | null

  @OneToMany(() => EvaluationDetail, (detail) => detail.COMPETENCY)
  EVALUATION_DETAILS: EvaluationDetail[]
}
