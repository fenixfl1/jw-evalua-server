import {
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Staff } from './Staff'
import { Evaluation } from './Evaluation'

@Entity('MODULE')
export class Module extends BaseEntity {
  @PrimaryColumn({ type: 'integer', generated: true })
  MODULE_ID: number

  @Column({ type: 'varchar', length: 150 })
  DESCRIPTION: string

  @Column({ type: 'integer' })
  SUPERVISOR_ID: number

  @ManyToOne(() => User, (user) => user.WORKTEAMS)
  @JoinColumn({ name: 'SUPERVISOR_ID' })
  SUPERVISOR: User

  @OneToMany(() => Staff, (user) => user.MODULE)
  MEMBERS: Staff[]

  @OneToMany(() => Evaluation, (evaluation) => evaluation.MODULE)
  EVALUATIONS: Evaluation[]
}
