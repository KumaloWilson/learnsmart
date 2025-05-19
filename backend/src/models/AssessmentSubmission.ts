import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { Assessment } from "./Assessment"
import { StudentProfile } from "./StudentProfile"
import { DataTypes } from "sequelize"

@Table({
  tableName: "assessment_submissions",
  timestamps: true,
})
export class AssessmentSubmission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileUrl?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileType?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileSize?: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  submissionDate!: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isLate!: boolean

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  marks?: number

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  feedback?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isGraded!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  gradedDate?: Date

  @ForeignKey(() => Assessment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  assessmentId!: string

  @BelongsTo(() => Assessment)
  assessment?: Assessment

  @ForeignKey(() => StudentProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentProfileId!: string

  @BelongsTo(() => StudentProfile)
  studentProfile?: StudentProfile
}
