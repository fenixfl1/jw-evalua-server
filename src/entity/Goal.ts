import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

export enum GoalScope {
  INDIVIDUAL = 'individual',
  MODULE = 'module',
}

@Entity('GOAL')
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @Column({ type: 'varchar' })
  DESCRIPTION: string

  @Column({ type: 'timestamp' })
  START_DATE: Date

  @Column({ type: 'timestamp' })
  END_DATE: Date

  @Column({ type: 'integer' })
  WEIGHT: number

  @Column({ name: 'SCOPE', type: 'enum', enum: GoalScope })
  SCOPE: GoalScope
}
