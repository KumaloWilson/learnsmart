import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "course_semesters",
  timestamps: true,
})
export class CourseSemester extends Model {
  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId!: string

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  semesterId!: string
}
