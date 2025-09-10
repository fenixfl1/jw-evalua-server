import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  Check,
  OneToMany,
  Index,
} from 'typeorm'
import { GoalProgress } from './GoalProgress'
import { GoalStaff } from './GoalStaff'
import { GoalModule } from './GoalModule'

export enum PeriodType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

@Entity({ name: 'PERIOD' })
@Unique('UQ_PERIOD_NAME', ['NAME'])
@Check(`"START_DATE" <= "END_DATE"`)
export class Period {
  @PrimaryGeneratedColumn({ name: 'PERIOD_ID' })
  ID!: number

  @Column({ name: 'NAME', type: 'varchar', length: 50 })
  @Index()
  NAME!: string

  @Column({ name: 'START_DATE', type: 'date' })
  START_DATE!: string

  @Column({ name: 'END_DATE', type: 'date' })
  END_DATE!: string

  @Column({ name: 'TYPE', type: 'enum', enum: PeriodType })
  TYPE!: PeriodType

  @OneToMany(() => GoalProgress, (gp) => gp.PERIOD)
  PROGRESSES!: GoalProgress[]

  @OneToMany(() => GoalStaff, (gxs) => gxs.PERIOD)
  GOAL_STAFF!: GoalStaff[]

  @OneToMany(() => GoalModule, (gxm) => gxm.PERIOD)
  GOAL_MODULES!: GoalModule[]
}

