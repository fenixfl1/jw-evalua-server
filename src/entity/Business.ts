import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('BUSINESS')
export class Business {
  @PrimaryColumn()
  BUSINESS_ID: number

  @Column({ type: 'varchar' })
  NAME: string

  @Column({ type: 'bytea', nullable: true })
  LOGO: string | null

  @Column({ type: 'text', nullable: true })
  LOGO_URL?: string

  @Column({ type: 'varchar' })
  RNC: string

  @Column({ type: 'varchar' })
  PHONE: string

  @Column({ type: 'text' })
  ADDRESS: string

  @Column({ type: 'char' })
  STATE: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATED_AT: Date | null

  @Column({ type: 'integer', nullable: true })
  CREATED_BY?: number

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  UPDATED_AT: Date | null

  @Column({ type: 'integer', nullable: true })
  UPDATED_BY?: number
}
