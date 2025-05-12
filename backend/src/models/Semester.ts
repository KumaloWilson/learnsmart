import { Table, Column, Model, DataType, BelongsToMany, HasMany } from "sequelize-typescript"
import { Course } from "./Course"
import { CourseSemester } from "./CourseSemester"
import { Period } from "./Period"
import { AcademicRecord } from "./AcademicRecord"

@Table({
  tableName: "semesters",
  timestamps: true,
})
export class Semester extends Model {
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
  name!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate!: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActive!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  academicYear!: number

  @BelongsToMany(
    () => Course,
    () => CourseSemester,
  )
  courses?: Course[]

  @HasMany(() => Period)
  periods?: Period[]
  
  @HasMany(() => AcademicRecord)
  academicRecords?: AcademicRecord[]
}