import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "learning_resources",
  timestamps: true,
})
export class LearningResource extends Model {
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
    type: DataType.ENUM("video", "article", "book", "exercise", "quiz", "other"),
    allowNull: false,
  })
  type!: "video" | "article" | "book" | "exercise" | "quiz" | "other"

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content?: string

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata?: any

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  tags?: string[]

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  difficulty!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  durationMinutes?: number

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
    allowNull: true,
  })
  semesterId?: string

  @BelongsTo(() => Semester)
  semester?: Semester
}
