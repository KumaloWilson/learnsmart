import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { Assessment } from "./Assessment"
import { Quiz } from "./Quiz"

@Table({
  tableName: "StudentPerformances",
  timestamps: true,
})
export class StudentPerformance extends Model {
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

  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId!: string

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  semesterId!: string

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  attendancePercentage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  assignmentAverage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  quizAverage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  overallPerformance!: number

  @Column({
    type: DataType.ENUM("excellent", "good", "average", "below_average", "poor"),
    allowNull: false,
  })
  performanceCategory!: "excellent" | "good" | "average" | "below_average" | "poor"

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  strengths?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  weaknesses?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  recommendations?: string

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  aiAnalysis?: object

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  lastUpdated!: Date

  @ForeignKey(() => Assessment)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assessmentId?: string

  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  quizId?: string

  @BelongsTo(() => StudentProfile)
  studentProfile?: StudentProfile

  @BelongsTo(() => Course)
  course?: Course

  @BelongsTo(() => Semester)
  semester?: Semester

  @BelongsTo(() => Assessment)
  assessment?: Assessment

  @BelongsTo(() => Quiz)
  quiz?: Quiz
}