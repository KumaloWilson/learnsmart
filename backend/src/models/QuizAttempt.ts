import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { Quiz } from "./Quiz"
import { StudentProfile } from "./StudentProfile"

@Table({
  tableName: "quiz_attempts",
  timestamps: true,
})
export class QuizAttempt extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  quizId!: string

  @BelongsTo(() => Quiz)
  quiz?: Quiz

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
    allowNull: false,
  })
  startTime!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endTime?: Date

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  questions!: object[]

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  answers?: object[]

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  score?: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isPassed?: boolean

  @Column({
    type: DataType.ENUM("in_progress", "completed", "timed_out", "submitted"),
    allowNull: false,
    defaultValue: "in_progress",
  })
  status!: "in_progress" | "completed" | "timed_out" | "submitted"

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  feedback?: string

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  aiAnalysis?: object
}
