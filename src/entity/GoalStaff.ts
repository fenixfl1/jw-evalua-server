import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Period } from './Period'

@Entity('GOAL_X_STAFF')
export class GoalStaff extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_STAFF_ID: number

  @Column({ type: 'integer' })
  GOAL_ID: number

  @Column({ type: 'integer' })
  STAFF_ID: number

  @Column({ type: 'integer' })
  PERIOD_ID: number

  @Column({ type: 'bigint' })
  TARGET_VALUE: number

  @Column({ type: 'decimal' })
  WEIGHT: number

  @ManyToOne(() => Period, { nullable: false })
  @JoinColumn({ name: 'PERIOD_ID' })
  PERIOD: Period
}
