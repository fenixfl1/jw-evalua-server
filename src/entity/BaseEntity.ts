import {
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  BaseEntity as Base,
  JoinColumn,
} from 'typeorm'
import { User } from './User'

export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ type: 'number', nullable: true })
  CREATED_BY?: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CREATED_BY' })
  CREATOR: User

  @Column({ type: 'char', length: 1, default: 'A' })
  STATE: string | null
}
