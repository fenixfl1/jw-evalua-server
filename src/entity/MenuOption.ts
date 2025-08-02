import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm'
import { Role } from './Role'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Permission } from './Permission'
@Entity('MENU_OPTION')
export class MenuOption {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  MENU_OPTION_ID: string

  @Column({ type: 'varchar', length: 100 })
  NAME: string

  @Column({ type: 'varchar', length: 250, nullable: true })
  DESCRIPTION?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  PATH?: string

  @Column({
    type: 'enum',
    nullable: true,
    enum: ['group', 'divider', 'link'],
  })
  TYPE?: string

  @Column({ type: 'text', nullable: true })
  ICON?: string

  @Column({ nullable: false })
  ORDER: number

  @Column({ type: 'varchar', nullable: true })
  PARENT_ID: string

  @ManyToOne(() => MenuOption, { nullable: true })
  @JoinColumn({ name: 'PARENT_ID' })
  PARENT?: MenuOption

  @OneToMany(() => MenuOption, (option) => option.PARENT)
  CHILDREN: MenuOption[]

  @ManyToMany(() => Role, (role) => role.MENU_OPTIONS)
  @JoinTable({
    name: 'MENU_OPTIONS_X_ROLES',
    joinColumn: {
      name: 'MENU_OPTION_ID',
      referencedColumnName: 'MENU_OPTION_ID',
    },
    inverseJoinColumn: { name: 'ROLE_ID', referencedColumnName: 'ROLE_ID' },
  })
  ROLES: Role[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ type: 'number', nullable: true })
  CREATED_BY?: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CREATED_BY' })
  CREATOR: User

  @Column({ type: 'char', length: 1, default: 'A' })
  STATE: string | null

  @OneToMany(() => Permission, (permission) => permission.MENU_OPTION)
  PERMISSIONS: Permission[]
}
