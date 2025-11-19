import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity({ name: 'PROCESS_AUDIT' })
export class ProcessAudit extends BaseEntity {
  @PrimaryGeneratedColumn()
  PROCESS_AUDIT_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @Column({ type: 'date' })
  AUDIT_DATE: Date

  @Column({ type: 'varchar', length: 50, nullable: true })
  SHIFT: string | null

  @Column({ type: 'varchar', length: 120, nullable: true })
  STYLE: string | null

  @Column({ type: 'varchar', length: 120, nullable: true })
  SUPERVISOR: string | null

  @Column({ type: 'varchar', length: 120, nullable: true })
  AUDITOR: string | null

  @Column({ type: 'jsonb' })
  ENTRIES: Record<string, any>[]

  @Column({ type: 'varchar', length: 255, nullable: true })
  COMMENTS: string | null
}
