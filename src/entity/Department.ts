import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

@Entity('DEPARTMENT')
export class Department {
  @PrimaryGeneratedColumn()
  DEPARTMENT_ID: number

  @Column({ type: 'varchar', length: 50 })
  NAME: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  DESCRIPTION: string

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
