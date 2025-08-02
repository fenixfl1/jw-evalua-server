import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { MenuOption } from './MenuOption'
import { User } from './User'
import { UserRoles } from './RolesUser'

@Entity('ROLE')
export class Role {
  @PrimaryGeneratedColumn()
  ROLE_ID: number

  @Column({ unique: true, length: 30, nullable: false })
  NAME: string

  @Column({ length: 250 })
  DESCRIPTION: string

  @ManyToMany(() => MenuOption, (menuOption) => menuOption.ROLES)
  MENU_OPTIONS: MenuOption[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ type: 'number', nullable: true })
  CREATED_BY?: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CREATED_BY' })
  CREATOR: User

  @Column({ type: 'char', length: 1, default: 'A' })
  STATE: string | null

  @OneToMany(() => UserRoles, (rolesXUser) => rolesXUser.ROLE)
  ROLES_X_USER: UserRoles[]
}
