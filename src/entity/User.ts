import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Role } from './Role'
import { Staff } from './Staff'
import { Module } from './Module'

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn()
  USER_ID: number

  @Column({ type: 'number' })
  STAFF_ID: number

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'STAFF_ID' })
  STAFF: Staff

  @Column({ type: 'varchar', nullable: false, length: 25 })
  USERNAME: string

  @Column({ type: 'varchar', nullable: false, select: false })
  PASSWORD: string

  @Column({ type: 'text', nullable: true })
  AVATAR: string

  @Column({ type: 'varchar', nullable: true })
  LOGIN_COUNT: number

  @Column({ type: 'timestamp', nullable: true })
  LAST_LOGIN: Date

  @Column({ type: 'bool' })
  IS_ACTIVE: boolean

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ nullable: true })
  CREATED_BY: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CREATED_BY' })
  CREATOR: User

  @Column({ type: 'char', length: 1, default: 'A' })
  STATE: string | null

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'ROLES_X_USER',
    joinColumn: { name: 'USER_ID', referencedColumnName: 'USER_ID' },
    inverseJoinColumn: { name: 'ROLE_ID', referencedColumnName: 'ROLE_ID' },
  })
  ROLES: Role[]

  @OneToMany(() => Module, (m) => m.SUPERVISOR)
  WORKTEAMS: Module[]

  @Column({ type: 'integer', nullable: true })
  MODULE_ID: number

  @ManyToOne(() => Module, (m) => m.MEMBERS)
  @JoinColumn({ name: 'MODULE_ID' })
  MODULE: Module
}
