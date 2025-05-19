import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "course_assignments",
  timestamps: true,
})
export class CourseAssignment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

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

  @Column({
    type: DataType.ENUM("primary", "assistant", "guest"),
    allowNull: false,
    defaultValue: "primary",
  })
  role!: "primary" | "assistant" | "guest"

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean
}
