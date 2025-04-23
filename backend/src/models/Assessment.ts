import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { AssessmentSubmission } from "./AssessmentSubmission"

@Table({
  tableName: "assessments",
  timestamps: true,
})
export class Assessment extends Model {
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
    type: DataType.ENUM("quiz", "assignment", "exam", "project", "other"),
    allowNull: false,
  })
  type!: "quiz" | "assignment" | "exam" | "project" | "other"

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalMarks!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  weightage!: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate!: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isPublished!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  publishDate?: Date

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

  @HasMany(() => AssessmentSubmission)
  submissions?: AssessmentSubmission[]
}
