import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from './User'

@Entity('ACTIVITY_LOG')
@Index('IDX_ACTIVITY_LOG_USER_CREATED_AT', ['USER_ID', 'CREATED_AT'])
export class ActivityLog {
  @PrimaryGeneratedColumn()
  ID: number

  @Column({ type: 'integer' })
  USER_ID: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'USER_ID' })
  USER: User

  @Column({ type: 'varchar', length: 100 })
  ACTION: string

  @Column({ type: 'varchar', length: 150 })
  MODEL: string

  @Column({ type: 'integer', nullable: true })
  OBJECT_ID: number

  @Column({ type: 'jsonb', nullable: true })
  CHANGES: Record<string, any>

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  CREATED_AT: Date

  @Column({ name: 'IP', type: 'inet', nullable: true })
  IP?: string

  @Column({ name: 'USER_AGENT', type: 'text', nullable: true })
  USER_AGENT?: string
}
