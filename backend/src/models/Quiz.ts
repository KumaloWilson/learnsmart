import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { QuizAttempt } from "./QuizAttempt"

@Table({
  tableName: "quizzes",
  timestamps: true,
})
export class Quiz extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  topic!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  numberOfQuestions!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  timeLimit!: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate!: Date

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 100,
  })
  totalMarks!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 50,
  })
  passingMarks!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRandomized!: boolean

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  aiPrompt?: object

  @Column({
    type: DataType.ENUM("multiple_choice", "true_false", "short_answer", "mixed"),
    allowNull: false,
    defaultValue: "mixed",
  })
  questionType!: "multiple_choice" | "true_false" | "short_answer" | "mixed"

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  instructions?: string

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

  @HasMany(() => QuizAttempt)
  attempts?: QuizAttempt[]
}
