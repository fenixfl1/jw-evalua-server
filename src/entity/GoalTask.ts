import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Goal } from './Goal'
import { GoalTaskStaff } from './GoalTaskStaff'
import { GoalModule } from './GoalModule'

@Entity({ name: 'GOAL_TASK' })
export class GoalTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_TASK_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_ID: number

  @Column({ type: 'integer', nullable: false })
  GOAL_MODULE_ID: number

  @Column({ type: 'varchar', nullable: false, length: 100 })
  DESCRIPTION: string

  @Column({ type: 'varchar', nullable: true, length: 500 })
  COMMENT: string

  @Column({ type: 'integer', nullable: false })
  TARGET: number

  @Column({
    type: 'numeric',
    nullable: false,
    default: 1,
    transformer: {
      to: (value?: number | null) => value ?? 1,
      from: (value: any) =>
        value === null || value === undefined ? 1 : Number(value),
    },
  })
  UNITS_PER_ITEM: number

  @ManyToOne(() => Goal, (goal) => goal.TASKS)
  @JoinColumn({ name: 'GOAL_ID' })
  GOAL: Goal

  @ManyToOne(() => GoalModule, (goalModule) => goalModule.TASKS, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'GOAL_MODULE_ID' })
  GOAL_MODULE: GoalModule

  @OneToMany(() => GoalTaskStaff, (gts) => gts.TASK)
  STAFF: GoalTaskStaff[]
}
