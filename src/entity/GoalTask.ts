import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Goal } from './Goal'
import { GoalTaskStaff } from './GoalTaskStaff'

@Entity({ name: 'GOAL_TASK' })
export class GoalTask extends BaseEntity {
  @PrimaryColumn({ type: 'integer' })
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_ID: number

  @Column({ type: 'varchar', nullable: false, length: 100 })
  DESCRIPTION: string

  @Column({ type: 'varchar', nullable: true, length: 500 })
  COMMENT: string

  @Column({ type: 'integer', nullable: false })
  TARGET: number

  @ManyToOne(() => Goal)
  @JoinColumn({ name: 'GOAL_ID' })
  GOAL: Goal

  @OneToMany(() => GoalTaskStaff, (gts) => gts.TASK)
  STAFF: GoalTaskStaff[]
}
