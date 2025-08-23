import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { Role } from './Role'

@Entity('ROLES_X_USER')
export class UserRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number

  @Column({ type: 'integer' })
  USER_ID: number

  @Column({ type: 'integer' })
  ROLE_ID: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  USER: User

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'ROLE_ID' })
  ROLE: Role
}
