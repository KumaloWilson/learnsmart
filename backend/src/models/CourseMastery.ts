import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "course_masteries",
  timestamps: true,
})
export class CourseMastery extends Model {
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
  masteryLevel!: number

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
  assignmentAverage!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  topicCompletionPercentage!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalTopicsCompleted!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalTopics!: number

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastUpdated!: Date
}
