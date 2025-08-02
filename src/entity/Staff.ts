import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Department } from './Department'

@Entity('STAFF')
export class Staff {
  @PrimaryGeneratedColumn()
  STAFF_ID: number

  @Column({ type: 'varchar' })
  NAME: string

  @Column({ type: 'varchar' })
  LAST_NAME: string

  @Column({ type: 'varchar' })
  EMAIL: string

  @Column({ type: 'date' })
  BIRTH_DATA: Date

  @Column({ type: 'varchar' })
  PHONE: string

  @Column({ type: 'char', length: 1 })
  GENDER: string

  @Column({ type: 'varchar', length: 11 })
  IDENTITY_DOCUMENT: string

  @Column({ type: 'text' })
  ADDRESS: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ type: 'number', nullable: true })
  CREATED_BY: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CREATED_BY' })
  CREATOR: User

  @Column({ type: 'char', length: 1, default: 'A' })
  STATE: string | null

  @Column({ type: 'number', nullable: true })
  DEPARTMENT_ID: number

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  DEPARTMENT: Department
}
