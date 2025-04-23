import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { LearningResource } from "./LearningResource"

@Table({
  tableName: "resource_interactions",
  timestamps: true,
})
export class ResourceInteraction extends Model {
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

  @Column({
    type: DataType.ENUM("view", "save", "complete", "rate", "share"),
    allowNull: false,
  })
  interactionType!: "view" | "save" | "complete" | "rate" | "share"

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  durationSeconds?: number

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

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata?: any
}
