import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Module } from './Module'
import { Staff } from './Staff'

@Entity('STAFF_X_MODULE')
export class StaffModule extends BaseEntity {
  @PrimaryColumn({ type: 'integer' })
  STAFF_MODULE_ID: number

  @Column({ type: 'integer' })
  STAFF_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff

  @ManyToOne(() => Module)
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module
}
