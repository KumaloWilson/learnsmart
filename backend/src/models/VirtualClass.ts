import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { VirtualClassAttendance } from "./VirtualClassAttendance"

@Table({
  tableName: "virtual_classes",
  timestamps: true,
})
export class VirtualClass extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledStartTime!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduledEndTime!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  meetingId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  meetingLink?: string

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  meetingConfig?: object

  @Column({
    type: DataType.ENUM("scheduled", "in_progress", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "scheduled",
  })
  status!: "scheduled" | "in_progress" | "completed" | "cancelled"

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualStartTime?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualEndTime?: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration?: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRecorded!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  recordingUrl?: string

  @ForeignKey(() => LecturerProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  lecturerProfileId!: string

  @BelongsTo(() => LecturerProfile)
  lecturerProfile?: LecturerProfile

  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId!: string

  @BelongsTo(() => Course)
  course?: Course

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  semesterId!: string

  @BelongsTo(() => Semester)
  semester?: Semester

  @HasMany(() => VirtualClassAttendance)
  attendances?: VirtualClassAttendance[]
}
