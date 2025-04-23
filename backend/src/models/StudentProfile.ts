import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { User } from "./User"
import { Program } from "./Program"

@Table({
  tableName: "student_profiles",
  timestamps: true,
})
export class StudentProfile extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  studentId!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth?: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string

  @Column({
    type: DataType.ENUM("active", "suspended", "graduated", "withdrawn"),
    allowNull: false,
    defaultValue: "active",
  })
  status!: "active" | "suspended" | "graduated" | "withdrawn"

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  currentLevel!: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  enrollmentDate!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  graduationDate?: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Program)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  programId!: string

  @BelongsTo(() => Program)
  program?: Program
}
