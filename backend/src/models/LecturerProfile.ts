import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { User } from "./User"
import { Department } from "./Department"
import { CourseAssignment } from "./CourseAssignment"

@Table({
  tableName: "lecturer_profiles",
  timestamps: true,
})
export class LecturerProfile extends Model {
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
  staffId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  specialization?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  officeLocation?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  officeHours?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string

  @Column({
    type: DataType.ENUM("active", "on_leave", "retired", "terminated"),
    allowNull: false,
    defaultValue: "active",
  })
  status!: "active" | "on_leave" | "retired" | "terminated"

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  joinDate!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  departmentId!: string

  @BelongsTo(() => Department)
  department?: Department

  @HasMany(() => CourseAssignment)
  courseAssignments?: CourseAssignment[]
}
