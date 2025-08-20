import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { Module } from './Module'

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
  MODULE_ID: number

  @ManyToOne(() => Module, { nullable: true })
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module
}
