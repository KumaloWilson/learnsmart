import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { CourseTopic } from "./CourseTopic"

@Table({
  tableName: "topic_progress",
  timestamps: true,
})
export class TopicProgress extends Model {
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

  @ForeignKey(() => CourseTopic)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseTopicId!: string

  @BelongsTo(() => CourseTopic)
  courseTopic?: CourseTopic

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
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  masteryLevel!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  timeSpentMinutes!: number

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  assessmentResults?: object
}
