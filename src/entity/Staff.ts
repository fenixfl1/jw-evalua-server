import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  Check,
} from 'typeorm'
import { User } from './User'
import { Module } from './Module'

export enum Gender {
  M = 'M',
  F = 'F',
  O = 'O',
}

@Entity('STAFF')
@Unique('UQ_STAFF_EMAIL', ['EMAIL'])
@Unique('UQ_STAFF_IDENTITY_DOCUMENT', ['IDENTITY_DOCUMENT'])
@Check('CHK_STAFF_GENDER', `"GENDER" IN ('M','F','O')`)
@Check('CHK_STAFF_IDENTITY_DOCUMENT', `"IDENTITY_DOCUMENT" ~ '^[0-9]{11}$'`)
export class Staff {
  @PrimaryGeneratedColumn()
  STAFF_ID: number

  @Column({ type: 'varchar' })
  NAME: string

  @Column({ type: 'varchar' })
  LAST_NAME: string

  @Column({ type: 'varchar' })
  EMAIL: string

  @Column({ name: 'BIRTH_DATE', type: 'date' })
  BIRTH_DATE: Date

  @Column({ type: 'varchar' })
  PHONE: string

  @Column({ type: 'enum', enum: Gender })
  GENDER: Gender

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

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  UPDATED_AT: Date | null

  @Column({ type: 'integer', nullable: true })
  UPDATED_BY?: number

  @Column({ type: 'number', nullable: true })
  MODULE_ID: number

  @ManyToOne(() => Module, { nullable: true })
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module
}
