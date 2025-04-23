import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { DataTypes } from "sequelize"

@Table({
  tableName: "student_performances",
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
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  attendancePercentage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  assignmentAverage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  quizAverage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  overallPerformance!: number

  @Column({
    type: DataType.ENUM("excellent", "good", "average", "below_average", "poor"),
    allowNull: false,
    defaultValue: "average",
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
    type: DataType.JSONB,
    allowNull: true,
  })
  aiAnalysis?: object

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  lastUpdated!: Date
}
