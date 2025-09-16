import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { GoalStaff } from './GoalStaff'
import { GoalModule } from './GoalModule'
import { GoalProgress } from './GoalProgress'
import { GoalScope } from './goal-scope.enum'

@Entity('GOAL')
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  GOAL_ID: number

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

  @OneToMany(() => GoalStaff, (goalStaff) => goalStaff.GOAL)
  STAFF: GoalStaff[]

  @OneToMany(() => GoalModule, (goalModule) => goalModule.GOAL)
  MODULES: GoalModule[]

  @OneToMany(() => GoalProgress, (progress) => progress.GOAL)
  PROGRESS: GoalProgress[]
}
