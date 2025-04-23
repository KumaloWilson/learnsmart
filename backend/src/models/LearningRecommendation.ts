import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { LearningResource } from "./LearningResource"
import { Course } from "./Course"

@Table({
  tableName: "learning_recommendations",
  timestamps: true,
})
export class LearningRecommendation extends Model {
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

  @ForeignKey(() => LearningResource)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  learningResourceId!: string

  @BelongsTo(() => LearningResource)
  learningResource?: LearningResource

  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId!: string

  @BelongsTo(() => Course)
  course?: Course

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason?: string

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  relevanceScore!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isViewed!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  viewedAt?: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSaved!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCompleted!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt?: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating?: number

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  feedback?: string
}
