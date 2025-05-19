import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "course_enrollments",
  timestamps: true,
})
export class CourseEnrollment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @ForeignKey(() => StudentProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentProfileId!: string

  @BelongsTo(() => StudentProfile)
  studentProfile?: StudentProfile

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
    type: DataType.ENUM("enrolled", "completed", "failed", "withdrawn"),
    allowNull: false,
    defaultValue: "enrolled",
  })
  status!: "enrolled" | "completed" | "failed" | "withdrawn"

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  grade?: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  letterGrade?: string
}
