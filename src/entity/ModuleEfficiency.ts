import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity({ name: 'MODULE_EFFICIENCY' })
export class ModuleEfficiency extends BaseEntity {
  @PrimaryGeneratedColumn()
  MODULE_EFFICIENCY_ID: number

  @Column({ type: 'integer' })
  MODULE_ID: number

  @Column({ type: 'integer' })
  PERIOD: number

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: { to: (v?: number) => v ?? null, from: (v: any) => (v === null ? null : Number(v)) } })
  TOTAL_UNITS: number

  @Column({ type: 'numeric', precision: 8, scale: 2, transformer: { to: (v?: number) => v ?? null, from: (v: any) => (v === null ? null : Number(v)) } })
  SAM: number

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: { to: (v?: number) => v ?? null, from: (v: any) => (v === null ? null : Number(v)) } })
  MINUTES_WORKED: number

  @Column({ type: 'numeric', precision: 8, scale: 2, transformer: { to: (v?: number) => v ?? null, from: (v: any) => (v === null ? null : Number(v)) } })
  EFFICIENCY_PERCENT: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  NOTES: string | null
}
