import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript"
import { Program } from "./Program"
import { Semester } from "./Semester"
import { CourseSemester } from "./CourseSemester"

@Table({
  tableName: "courses",
  timestamps: true,
})
export class Course extends Model {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  level!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 3,
  })
  creditHours!: number

  @ForeignKey(() => Program)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  programId!: string

  @BelongsTo(() => Program)
  program?: Program

  @BelongsToMany(
    () => Semester,
    () => CourseSemester,
  )
  semesters?: Semester[]
}
