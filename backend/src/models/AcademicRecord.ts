import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { StudentProfile } from "./StudentProfile"
import { Semester } from "./Semester"

@Table({
  tableName: "academic_records",
  timestamps: true,
})
export class AcademicRecord extends Model {
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
    defaultValue: 0.0,
  })
  gpa!: number

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  })
  cgpa!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalCredits!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  earnedCredits!: number

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  remarks?: string
}
