import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "at_risk_students",
  timestamps: true,
})
export class AtRiskStudent extends Model {
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
  })
  riskScore!: number

  @Column({
    type: DataType.ENUM("low", "medium", "high", "critical"),
    allowNull: false,
  })
  riskLevel!: "low" | "medium" | "high" | "critical"

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  riskFactors!: string[]

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  recommendedActions?: string

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  aiAnalysis?: object

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isResolved!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolvedAt?: Date

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  resolutionNotes?: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  lastUpdated!: Date
}
