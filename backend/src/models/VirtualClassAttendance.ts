import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { VirtualClass } from "./VirtualClass"
import { StudentProfile } from "./StudentProfile"

@Table({
  tableName: "virtual_class_attendances",
  timestamps: true,
})
export class VirtualClassAttendance extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @ForeignKey(() => VirtualClass)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  virtualClassId!: string

  @BelongsTo(() => VirtualClass)
  virtualClass?: VirtualClass

  @ForeignKey(() => StudentProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentProfileId!: string

  @BelongsTo(() => StudentProfile)
  studentProfile?: StudentProfile

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  joinTime?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  leaveTime?: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  durationMinutes?: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPresent!: boolean

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string
}
