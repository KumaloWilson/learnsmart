import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { Department } from "./Department"
import { Course } from "./Course"

@Table({
  tableName: "programs",
  timestamps: true,
})
export class Program extends Model {
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
    allowNull: true,
  })
  code?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 4,
  })
  durationYears!: number

  @Column({
    type: DataType.ENUM("undergraduate", "postgraduate", "doctorate"),
    allowNull: false,
    defaultValue: "undergraduate",
  })
  level!: "undergraduate" | "postgraduate" | "doctorate"

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  departmentId!: string

  @BelongsTo(() => Department)
  department?: Department

  @HasMany(() => Course)
  courses?: Course[]
}
