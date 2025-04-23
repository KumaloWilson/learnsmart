import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { StudentProfile } from "./StudentProfile"

@Table({
  tableName: "physical_attendances",
  timestamps: true,
})
export class PhysicalAttendance extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  topic?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string

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

  @ForeignKey(() => StudentProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentProfileId!: string

  @BelongsTo(() => StudentProfile)
  studentProfile?: StudentProfile

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPresent!: boolean
}
